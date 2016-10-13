<?php

class BusquedasController extends BaseController {


	// funcion para mostrar ajustadores de una localidad
	public function atenciones($folio){

		return Atencion::where('EXP_folio', $folio)->get();
		
	}

	// funcion para mostrar las atenciones de un folio
	public function ajustadores($localidad){

		return Ajustador::activos($localidad);
		
	}


	// funcion para mostrar autorizaciones de un folio
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


	//muestra todas las aseguradoras
	public function clientes(){
		return Compania::activos();
	}

	//da el detalle de una atencion
	public function detalleAtencion($clave){

		$respuesta = array();
		$atencion = Atencion::join('TipoAtencion','TipoAtencion.TIA_clave','=','Atenciones.TIA_clave')->find($clave);

		$folio = $atencion->Exp_folio;
		$tipoAtn = $atencion->TIA_clave;
		$producto = Expediente::find($folio)->Pro_clave;

		$tiposDocumento = $this->documentos($tipoAtn,$producto);
		$imagenes = $this->imagenes($clave);

		//requisitos de una atencion
		$requisitos = Requisito::where('TIA_clave',$tipoAtn)->get();

		//anotaciones que ya se generaron segun los requisitos
		$anotaciones = Anotacion::where('ATN_clave',$clave)->get();

		$respuesta['info'] = $atencion;
		$respuesta['tipos'] = $tiposDocumento;
		$respuesta['imagenes'] = $imagenes;
		$respuesta['requisitos'] = $requisitos;
		$respuesta['anotaciones'] = $anotaciones;

		return $respuesta;
		
	}


	//genera un detalle de folio
	public function detalleFolio($folio){

		// si no tiene el codigo lo genera 
		if (! File::exists( public_path() . '/codigos/'. $folio .'.png' )){
			// mandamos a llamar la accion del controlador para generar codigos
		    App::make('OperacionController')->generaCodigo($folio);
		}

		return Expediente::join('Unidad','Unidad.Uni_clave','=','Expediente.Uni_clave')
					     ->join('Producto','Producto.Pro_clave','=','Expediente.Pro_clave')
					     ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
					     ->leftJoin('RiesgoAfectado','RiesgoAfectado.RIE_clave','=','Expediente.RIE_clave')
						 ->where('Exp_folio',$folio)
						 ->first();
	}

	public function documentoSolicitud(){
		return DocumentoSolicitud::activos();
	}


	// funcion para ver los documentos registrados por producto y tipo de atencion
	public function documentos($tipoAtn,$producto){

		return AtencionDocumento::join('TipoDocumento','TipoDocumento.TID_claveint','=','AtencionDocumento.TID_clave')
								->select('TipoDocumento.*')
								->where(array( 'TIA_clave' => $tipoAtn, 'Pro_clave' => $producto ))->get();
	}


	// muestra el historial del folio
	public function historial($folio){


		$historial = Historial::where('Exp_folio',$folio)
							  ->select('HIS_fecha as fecha','HIS_titulo as titulo','HIS_descripcion as descripcion')
							  ->get();


		// en caso de tener no tener historial en la tabla genera uno segun lo registrado en cada tabla
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
								   ->where( array( 'REG_folio' => $folio) )->get();

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


	// cargamos todas las imagenes de la atencion
	public function imagenes($atencion){
		
		
		$imagenes =  Imagenes::disponibles($atencion);

		foreach ($imagenes as $imagen) {

			$tipo = $imagen['tipo'];

			$atencionDocumento = AtencionTipoDocumento::where( array('ATN_clave' => $atencion, 'TID_clave' => $tipo) )->first();

			if ( count($atencionDocumento) > 0 ) {
				$imagen['estatusGlobal'] = $atencionDocumento->ATD_estatus;
				$imagen['motivoGlobal'] = $atencionDocumento->ATD_motivo;

				if ($atencionDocumento->ATD_estatus == 0) {
					$imagen['estatusGlobalIcon'] = 'check_box_outline_blank';	
				}elseif ($atencionDocumento->ATD_estatus == 1) {
					$imagen['estatusGlobalIcon'] = 'check_box';	
				}elseif ($atencionDocumento->ATD_estatus == 2) {
					$imagen['estatusGlobalIcon'] = 'error';	
				}

			}else{
				$imagen['estatusGlobal'] = 0;
				$imagen['estatusGlobalIcon'] = 'folder';
				$imagen['motivoGlobal'] = '';
			}

		}

		return $imagenes;

	}

	//funcion que devuelve los documentos disponibles segun el producto y tipo atencion
	function productoAtencionDocumentos(){
		$producto = Input::get('producto');
		$atencion = Input::get('atencion');
		return AtencionDocumento::where( array( 'Pro_clave' => $producto,'TIA_clave' => $atencion) )->get();
	}

	// muestra toos los producto activos
	public function productos(){
		return Producto::activos();
	}


	// muestra los productos activos segun el cliente
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


	// consulta de registros segun los parametros enviados por unidad
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


	// consulta de los registros de cualquier unidad segun los parametros dados
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


	// consulta los riesgos activos
	public function riesgos(){
		return Riesgo::activos();
	}

	// consulta los tickets de un folio
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


	//muestra los tipos de atenciones que existen activos
	public function tiposAtencion(){
		return TipoAtencion::activos();
	}

	//muestra los tipos de telefono
	public function tiposTelefono(){
		return TipoTelefono::all();
	}


	// muestra los tipos de documentos activos
	public function tiposDocumento(){

		return tipoDocumentos::where(array(
				'TID_activa' => 1,
				'TID_red' => 1
			))
			->orderBy('TID_orden')
			->get();
	}
}
