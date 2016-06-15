<?php

class BusquedasController extends BaseController {

	public function clientes(){
		return Compania::activos();
	}

	public function productos(){
		return Producto::activos();
	}

	public function productosCliente($cliente,$unidad){

	}
}
