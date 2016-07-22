<?php

class BusquedasController extends BaseController {

	public function ajustadores($localidad){

		return Ajustador::activos($localidad);
		
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
		if (Input::has('lesionado')) {									
			$query->where( 'Exp_completo','LIKE','%' . Input::get('lesionado') . '%');
		}								

		return $query->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
					 ->where('Uni_clave',$unidad)
					 ->select('Exp_folio','Exp_fecreg','Exp_completo','Exp_obs','Uni_clave','Expediente.Cia_clave','Cia_logo')
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
		
	}

	public function tipos(){
		return TipoTelefono::all();
	}
}
