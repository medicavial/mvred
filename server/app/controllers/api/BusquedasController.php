<?php

class BusquedasController extends BaseController {

	public function ajustadores($localidad){

		return Ajustador::activos($localidad);
		
	}

	public function clientes(){
		return Compania::activos();
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

		$unidad = Input::get('unidad');

		if ( Input::has('folio') ) {

			$folio = Input::get('folio');

			return Expediente::join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
							 ->where('Exp_folio',$folio)
							 ->where('Uni_clave',$unidad)
							 ->select('Exp_folio','Exp_fecreg','Exp_completo','Exp_obs','Uni_clave','Expediente.Cia_clave','Cia_logo')
							 ->orderBy('Exp_fecreg','DESC')
							 ->get();

		}elseif ( Input::has('lesionado') ) {

			$lesionado = Input::get('lesionado');

			return Expediente::join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
							 ->where('Exp_completo','LIKE','%' . $lesionado . '%')
							 ->where('Uni_clave',$unidad)
							 ->select('Exp_folio','Exp_fecreg','Exp_completo','Exp_obs','Uni_clave','Expediente.Cia_clave','Cia_logo')
							 ->orderBy('Exp_fecreg','DESC')
							 ->get();

		}else{

			return Expediente::join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
							 ->where('Uni_clave',$unidad)
							 ->select('Exp_folio','Exp_fecreg','Exp_completo','Exp_obs','Uni_clave','Expediente.Cia_clave','Cia_logo')
							 ->orderBy('Exp_fecreg','DESC')
							 ->take(30)->get();

		}

		// return Input::all();

	}

	public function riesgos(){
		return Riesgo::activos();
	}

	public function tipos(){
		return TipoTelefono::all();
	}
}
