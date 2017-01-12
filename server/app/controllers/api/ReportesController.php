<?php

class ReportesController extends BaseController {


	//funciones de las rutas
	public function atencionesUnidadAnio($unidad){

        $fechaini = date('Y-m-d', strtotime('-11 month'));
        $fechafin = date('Y-m-d');

        $sql = "SELECT MONTH(Exp_fecreg) as clave, YEAR(Exp_fecreg) as ano,
            CASE WHEN MONTH(Exp_fecreg) = 1 THEN concat('Ene. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 2 THEN concat('Feb. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 3 THEN concat('Mar. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 4 THEN concat('Abr. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 5 THEN concat('May. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 6 THEN concat('Jun. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 7 THEN concat('Jul. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 8 THEN concat('Ago. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 9 THEN concat('Sep. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 10 THEN concat('Oct. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 11 THEN concat('Nov. ',YEAR(Exp_fecreg))
            WHEN MONTH(Exp_fecreg) = 12 THEN concat('Dic. ',YEAR(Exp_fecreg))
            ELSE 'esto no es un mes' END AS MES,
            count(Exp_folio) as Cantidad  FROM Expediente
    		WHERE Exp_fecreg between '$fechaini 00:00:00' and '$fechafin 23:59:59'  and EXP_cancelado = 0 and Uni_clave = $unidad
    		group by MONTH(Exp_fecreg) order by YEAR(Exp_fecreg),MONTH(Exp_fecreg)";

    	return DB::select($sql);


	}

	//funciones de las rutas
	public function atencionesUnidadMes($unidad){

		$fechaini = date('Y-m-01');
    	$fechafin = date('Y-m-d');

		$sql = "SELECT concat('Semana ', WEEK(Exp_fecreg) ) as Semana,
            	count(Exp_folio) as Cantidad  FROM Expediente       
				WHERE Exp_fecreg between '$fechaini 00:00:00' and '$fechafin 23:59:59'  and EXP_cancelado = 0 
				and Uni_clave = $unidad group by WEEK(Exp_fecreg)";

		return DB::select($sql);

	}

    //funcion para mostrarles cuanto tienen de faltantes
    public function notificacionUnidad($unidad){

        $respuesta = array();

        // registros sin atenciones dadas de alta
        $respuesta['expedientesSA'] = Expediente::where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad
                        ) )
                        ->whereNotIn('Exp_folio', function($q){
                              $q->select('Exp_folio')
                                ->from('Atenciones');
                        })
                        ->count();

        //atenciones sin documentos
        $respuesta['atencionesSD'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 0
                        ) )
                        ->whereNotIn('Atenciones.Exp_folio', function($q){
                              $q->select('REG_folio')
                                ->from('DocumentosDigitales');
                        })
                        ->count();

        //atenciones con documentos sin enviar a revision 
        $respuesta['atencionesCDSL'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 0
                        ) )
                        ->whereIn('Atenciones.Exp_folio', function($q){
                              $q->select('REG_folio')
                                ->from('DocumentosDigitales');
                        })
                        ->count();

        return $respuesta;

    }

    public function estadisticaUnidad(){
        

        $respuesta = array();

        $unidad = Input::get('unidad');
        $fechaini = Input::get('fechaIni') . ' 00:00:00';
        $fechafin = Input::get('fechaFin') . ' 23:59:59';

        // $fechaini = date('2016-01-01') . ' 00:00:00';
        // $fechafin = date('Y-m-d') . ' 23:59:59';

        $respuesta['fechaIni'] = $fechaini;
        $respuesta['fechaFin'] = $fechafin;

        $respuesta['expedientes'] = Expediente::where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();


        // registros sin atenciones dadas de alta
        $respuesta['expedientesSA'] = Expediente::where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))
                        ->whereNotIn('Exp_folio', function($q){
                              $q->select('Exp_folio')
                                ->from('Atenciones');
                        })
                        ->count();

        //atenciones sin documentos
        $respuesta['atencionesEt1SD'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 0
                        ) )
                        ->whereNotIn('Atenciones.Exp_folio', function($q){
                              $q->select('REG_folio')
                                ->from('DocumentosDigitales');
                        })
                        ->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        //atenciones con documentos sin enviar a revision 
        $respuesta['atencionesEt1CDSL'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 0
                        ) )
                        ->whereIn('Atenciones.Exp_folio', function($q){
                              $q->select('REG_folio')
                                ->from('DocumentosDigitales');
                        })
                        ->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        //atenciones enviadas a revision
        $respuesta['atencionesEt1CDSR'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 1
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        //atenciones autorizadas
        $respuesta['atencionesEt1ASF'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 2
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        //atenciones rechazadas
        $respuesta['atencionesEt1R'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 3
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        //atenciones enviadas a revsion la Factura
        $respuesta['atencionesEt1RF'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 5
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();


        //atenciones factura Autorizada
        $respuesta['atencionesEt1FA'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 7
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        //atenciones factura Rechazada
        $respuesta['atencionesEt1FR'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 6
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        //atenciones pagadas
        $respuesta['atencionesEt1P'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->where( array(                            
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 4
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();


        // $respuesta['atencionesEt2CDSR'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
        //                 ->where( array(
        //                     'TIA_clave' => 2,
        //                     'Exp_cancelado' => 0,
        //                     'Uni_clave' => $unidad,
        //                     'ATN_estatus' => 1
        //                 ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        // $respuesta['atencionesEt2ASF'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
        //                 ->where( array(
        //                     'TIA_clave' => 2,
        //                     'Exp_cancelado' => 0,
        //                     'Uni_clave' => $unidad,
        //                     'ATN_estatus' => 2
        //                 ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        // $respuesta['atencionesEt2R'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
        //                 ->where( array(
        //                     'TIA_clave' => 2,
        //                     'Exp_cancelado' => 0,
        //                     'Uni_clave' => $unidad,
        //                     'ATN_estatus' => 3
        //                 ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();


        // $respuesta['atencionesEt3CDSR'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
        //                 ->where( array(
        //                     'TIA_clave' => 3,
        //                     'Exp_cancelado' => 0,
        //                     'Uni_clave' => $unidad,
        //                     'ATN_estatus' => 1
        //                 ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        // $respuesta['atencionesEt3ASF'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
        //                 ->where( array(
        //                     'TIA_clave' => 3,
        //                     'Exp_cancelado' => 0,
        //                     'Uni_clave' => $unidad,
        //                     'ATN_estatus' => 2
        //                 ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();

        // $respuesta['atencionesEt3R'] = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
        //                 ->where( array(
        //                     'TIA_clave' => 3,
        //                     'Exp_cancelado' => 0,
        //                     'Uni_clave' => $unidad,
        //                     'ATN_estatus' => 3
        //                 ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->count();


        return $respuesta;

    }

    public function listado(){

        $tipo = Input::get('tipo');
        $unidad = Input::get('unidad');
        $fechaini = Input::get('fechaIni') . ' 00:00:00';
        $fechafin = Input::get('fechaFin') . ' 23:59:59';

        if($tipo == 'expedientes'){

            $datos = Expediente::join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }


        if($tipo == 'sinAtn'){

            $datos = Expediente::join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad
                        ) )
                        ->whereNotIn('Exp_folio', function($q){
                              $q->select('Exp_folio')
                                ->from('Atenciones');
                        })
                        ->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }

        if($tipo == 'documentos'){
            
            $datos = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->join('TipoAtencion','TipoAtencion.TIA_clave','=','Atenciones.TIA_clave')
                        ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 0
                        ) )
                        ->whereNotIn('Atenciones.Exp_folio', function($q){
                              $q->select('REG_folio')
                                ->from('DocumentosDigitales');
                        })
                        ->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }

        if($tipo == 'documentosSinA'){
            
            $datos = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->join('TipoAtencion','TipoAtencion.TIA_clave','=','Atenciones.TIA_clave')
                        ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 0
                        ) )
                        ->whereIn('Atenciones.Exp_folio', function($q){
                              $q->select('REG_folio')
                                ->from('DocumentosDigitales');
                        })
                        ->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }

        if($tipo == 'autorizar'){

            $datos = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->join('TipoAtencion','TipoAtencion.TIA_clave','=','Atenciones.TIA_clave')
                        ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 1
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }

        if($tipo == 'facturar'){

            $datos = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->join('TipoAtencion','TipoAtencion.TIA_clave','=','Atenciones.TIA_clave')
                        ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 2
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }

        if($tipo == 'rechazos'){

            $datos = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->join('TipoAtencion','TipoAtencion.TIA_clave','=','Atenciones.TIA_clave')
                        ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 3
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }


        if($tipo == 'revisionFac'){

            $datos = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->join('TipoAtencion','TipoAtencion.TIA_clave','=','Atenciones.TIA_clave')
                        ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 5
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }

        if($tipo == 'facturaAut'){

            $datos = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->join('TipoAtencion','TipoAtencion.TIA_clave','=','Atenciones.TIA_clave')
                        ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 7
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }

        if($tipo == 'facturaRec'){

            $datos = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->join('TipoAtencion','TipoAtencion.TIA_clave','=','Atenciones.TIA_clave')
                        ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 6
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }

        if($tipo == 'pagados'){

            $datos = Atencion::join('Expediente','Expediente.Exp_folio','=','Atenciones.Exp_folio')
                        ->join('TipoAtencion','TipoAtencion.TIA_clave','=','Atenciones.TIA_clave')
                        ->join('Compania','Compania.Cia_clave','=','Expediente.Cia_clave')
                        ->where( array(
                            'Exp_cancelado' => 0,
                            'Uni_clave' => $unidad,
                            'ATN_estatus' => 4
                        ) )->whereBetween('Exp_fecreg', array($fechaini, $fechafin))->get();
        }

        return $datos;

    }

	
}
