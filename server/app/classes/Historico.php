<?php

class Historico {
	
	public $titulo;
	public $descricion;
	public $folio;
	public $usuario;
	public $etapa;
	public $entrega;

	public function guardar(){

		$Historial = new Historial;
		$Historial->HIS_fecha = date('Y-m-d H:i:s');
		$Historial->HIS_titulo = $this->titulo;
		$Historial->HIS_descripcion = $this->descripcion;
		$Historial->Exp_folio = $this->folio;
		$Historial->Exp_etapa = $this->etapa;
		$Historial->Exp_entrega = $this->entrega;
		$Historial->USU_login = $this->usuario;
		$Historial->save();
	}

}

