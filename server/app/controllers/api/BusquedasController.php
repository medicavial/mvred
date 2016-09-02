<?php

class BusquedasController extends BaseController {

	public function ajustadores($localidad){

		return Ajustador::activos($localidad);
		
	}

	public function autorizaciones($folio){

		$respuesta = array();
		// se verifica si tiene autorizaciones el folio
		$autorizacion = Autorizacion::where('AUM_folioMV',$folio)->first();

		if ($autorizacion) {
			
			$movimientos = Movimiento::join('TipoMovimiento','TipoMovimiento.TIM_claveint','=','MovimientoAut.TIM_claveint')
									 ->where('AUM_clave',$autorizacion->AUM_clave)->get();


			$respuesta['datos'] = $autorizacion;
			$respuesta['movimientos'] = $movimientos;

		}

		return $respuesta;
		
	}

	public function clientes(){
		return Compania::activos();
	}

	public function detalleFolio($folio){
		return Expediente::join('Unidad','Unidad.Uni_clave','=','Expediente.Uni_clave')
					     ->join('Producto','Producto.Pro_clave','=','Expediente.Pro_clave')
					     ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
					     ->join('RiesgoAfectado','RiesgoAfectado.RIE_clave','=','Expediente.RIE_clave')
						 ->where('Exp_folio',$folio)
						 ->first();
	}

	public function documentos(){
		return Documento::activos();
	}


	public function historial($folio){


		$historial = Historial::where('Exp_folio',$folio)
							  ->select('HIS_fecha as fecha','HIS_titulo as titulo','HIS_descripcion as descripcion')
							  ->get();



		if (count($historial) == 0) {
			
			$historial = array();

			// se carga el registro
			$expediente = Expediente::find($folio);

			$registro = array('fecha'=> $expediente->Exp_fecreg,'titulo' => 'Registro de Expediente','descripcion' => 'Se registro el paciente '. $expediente->Exp_completo . ' por el usuario ' . $expediente->Usu_registro);
			array_push($historial,$registro);


			// se verifica si tiene autorizaciones el folio
			$autorizacion = Autorizacion::where('AUM_folioMV',$folio)->first();

			if ($autorizacion) {
				
				$aut = array('fecha'=> $autorizacion->AUM_fechaReg,'titulo' => 'Registro de Autorización Médica ' . $autorizacion->AUM_clave,'descripcion' => 'Diagnostico '. $autorizacion->AUM_diagnostico . ' Descripción Médica ' . $autorizacion->AUM_descripcionmedica);
				array_push($historial,$aut);

				$movimientos = Movimiento::join('TipoMovimiento','TipoMovimiento.TIM_claveint','=','MovimientoAut.TIM_claveint')
										 ->where('AUM_clave',$autorizacion->AUM_clave)->get();

				foreach ($movimientos as $movimiento) {
					
					$mov = array('fecha'=> $movimiento->MOA_fecha,'titulo' => 'Se autorizó: '.$movimiento->TIM_nombreE,'descripcion' => $movimiento->MOA_texto);
					array_push($historial,$mov);

				}

			}

			$imagenesEt1 = Imagenes::join('TipoDocumento','TipoDocumento.TID_claveint','=','DocumentosDigitales.Arc_tipo')
								   ->where( array( 'REG_folio' => $folio,'Exp_etapa' => 1 ) )->get();

			foreach ($imagenesEt1 as $imagen) {
				$altaImagen = array('fecha'=> $imagen->Arc_fecreg,'titulo' => 'Se ingreso imagen : '.$imagen->TID_nombre,'descripcion' => 'Se ingresó imagen del folio por el usuario ' .$imagen->USU_login);
				array_push($historial,$altaImagen);

				if ($imagen->Arc_autorizado == 1) {
					
					$imagenAut = array('fecha'=> $imagen->Arc_fechaAut,'titulo' => 'Se autorizó imagen : '.$imagen->TID_nombre,'descripcion' => 'Se autorizó imagen del folio por el usuario '. $imagen->USU_autorizo);
					array_push($historial,$imagenAut);

				}

				if ($imagen->Arc_rechazado == 1) {
					
					$imagenAut = array('fecha'=> $imagen->Arc_fechaAut,'titulo' => 'Se rechazo imagen : '.$imagen->TID_nombre,'descripcion' => 'Se rechazo imagen del folio por el usuario '. $imagen->USU_rechazo . ' Por motivo: ' . $imagen->Arc_motivo);
					array_push($historial,$imagenAut);
					
				}
			}
		}

		return $historial;

	}


	// cargamos todas las imagenes del folio
	public function imagenes($folio){
		
		//Iniciamos con etapa 1
		return Imagenes::disponibles($folio,1,1);

	}

	public function productos(){
		return Producto::activos();
	}

	public function productosCliente($cliente,$localidad){

		$productosDisponibles = array();

		//verificar la referencia existente segun el cliente
		$productosCliente = referenciaProducto::where('Cia_clave',$cliente);


		//si existe alguna referencia entra
		if ($productosCliente->count() > 0) {
			# code...
			foreach ($productosCliente->get() as $producto) {
				
				$claveProducto = $producto->Pro_clave;
				$claves = explode("," , $producto->REF_clave);

				// si el producto es aplicable a todas las localidades
				if ($producto->REF_condicion == 'todo') {

					$datosProducto = Producto::find($claveProducto);

					array_push($productosDisponibles,$datosProducto);

				// si el producto es aplicable a una localidad en especifico
				}elseif ($producto->REF_condicion == 'igual' && in_array($localidad, $claves) ) {

					$datosProducto = Producto::find($claveProducto);

					array_push($productosDisponibles,$datosProducto);

				// si el producto es aplicable a una localidad exceptuando las localidades clave
				}elseif ($producto->REF_condicion == 'menos' && !in_array($localidad, $claves) ) {
					
					$datosProducto = Producto::find($claveProducto);

					array_push($productosDisponibles,$datosProducto);

				}

			}

			return $productosDisponibles;

		// si no hay refrencias manda solo producto accidente vial
		}else{

			//regresar solo accidente vial por defecto
			return Producto::where('Pro_clave',1)->get();
		}

	}

	public function registros(){


		$query = Expediente::query();

		$limite = Input::get('limit');
		$order = Input::get('order');
		$unidad = Input::get('unidad');

		$pos = strpos($order, '-');

		if ($pos === false) {
			$tipo = 'ASC';
		}else{
			$tipo = 'DESC';
			$order = substr($order, 1);
		}


	 	if (Input::has('folio')) {
	 		$query->where( 'Exp_folio', Input::get('folio'));
		}

		if (Input::has('folioInt')) {									
			$query->where( 'Exp_fq', Input::get('folioInt'));
		}

		if (Input::has('lesionado')) {									
			$query->where( 'Exp_completo','LIKE','%' . Input::get('lesionado') . '%');
		}								

		return $query->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
					 ->select('Exp_folio','Exp_fecreg','Exp_completo','Exp_obs','Uni_clave','Expediente.Cia_clave','Cia_logo','Exp_fq')
					 ->where('Uni_clave',$unidad)
					 ->orderBy($order,$tipo)
					 ->paginate($limite);


	}

	public function registrosGlobales(){


		$query = Expediente::query();

		$limite = Input::get('limit');
		$order = Input::get('order');

		$pos = strpos($order, '-');

		if ($pos === false) {
			$tipo = 'ASC';
		}else{
			$tipo = 'DESC';
			$order = substr($order, 1);
		}


	 	if (Input::has('folio')) {
	 		$query->where( 'Exp_folio', Input::get('folio'));
		}
		if (Input::has('lesionado')) {									
			$query->where( 'Exp_completo','LIKE','%' . Input::get('lesionado') . '%');
		}								

		return $query->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
					 ->select('Exp_folio','Exp_fecreg','Exp_completo','Exp_obs','Uni_clave','Expediente.Cia_clave','Cia_logo')
					 ->orderBy($order,$tipo)
					 ->paginate($limite);


	}

	public function riesgos(){
		return Riesgo::activos();
	}

	public function tickets($folio){
		$datos = Ticket::leftJoin('TicketSubcat','TicketSubcat.TSub_clave','=','TicketSeguimiento.TSub_clave')
						->leftJoin('TicketCat','TicketCat.TCat_clave','=','TicketSeguimiento.TCat_clave')
						->leftJoin('TicketStatus','TicketStatus.TStatus_clave','=','TicketSeguimiento.TStatus_clave')
						->where('Exp_folio',$folio)
						->get();

		$respuesta = array();

		foreach ($datos as $dato) {
			$clave = $dato['TSeg_clave'];

			$notas = TicketNotas::where('TSeg_clave',$clave)
								->where('Exp_folio',$folio)
								->get();

			$ticket = array(
				'TSeg_clave' => $clave,
				'TSeg_fechareg' => $dato['TSeg_fechareg'],
				'TStatus_nombre' => $dato['TStatus_nombre'],
				'TSeg_fechaactualizacion' => $dato['TSeg_fechaactualizacion'],
				'TCat_nombre' => $dato['TCat_nombre'],
				'TSub_nombre' => $dato['TSub_nombre'],
				'TSeg_obs' => $dato['TSeg_obs'],
				'notas' => $notas
			);

			array_push($respuesta, $ticket);	
		}

		return $respuesta;
	}

	public function tipos(){
		return TipoTelefono::all();
	}

	public function tiposDocumento(){
		return tipoDocumentos::where(array( 'TID_red' => 1 ,'TID_activa' => 1))
							 ->orderBy('TID_orden')
							 ->get();
	}
}
