<?php

class BusquedasController extends BaseController {

	public function clientes(){
		return Compania::activos();
	}
}
