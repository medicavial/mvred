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

    public function estadisticas(){
        
    }

	
}
