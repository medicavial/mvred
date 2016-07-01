<?php

class OperacionController extends BaseController {


	//funciones de las rutas
	public function registraFolio(){
	

		//obtenemos la unidad para generar datos del folio
		$unidad = Input::get('unidad');

		//se obtiene el prefijo segun la unidad
		$prefijo = Prefijo::where('Uni_clave',$unidad)->first()->Pre_prefijo;
		//se da el consecutivo segun el registro y el prefijo
		$consecutivo = Expediente::where('Exp_prefijo',$prefijo)->max('EXP_cons');

		//en caso de no existir el consecutivo
		if (!$consecutivo) {
			$consecutivo = 1;
		}else{
			$consecutivo++;
		}

		// se generan los ceros necesarios para el folio
		$c="000000".$consecutivo;
		$c=substr($c,-6,6);
		$folio = $prefijo.$c;

		$fechaNacimiento = Input::get('fechaNac');

		$edad = $this->calculaEdad($fechaNacimiento);

		$anios = $edad['anios'];
		$meses = $edad['meses'];

		$fechaRegistro = date("Y-m-d H:i:s");

		$nombre = Input::get('nombre');
		$amaterno = Input::get('amaterno');
		$apaterno = Input::get('apaterno');

		$nombreCompleto = $nombre . ' ' . $apaterno . ' ' . $amaterno;

		$tipoTel = Input::get('tipotel');

		$tipoTelefono = TipoTelefono::find($tipoTel)->TT_tipotelefono;

		$telefono = $tipoTelefono . '-' . Input::get('telefono');


		$expediente = new Expediente;
		$expediente->Exp_folio = $folio;
		$expediente->Exp_prefijo = $prefijo;
		$expediente->Exp_cons = $consecutivo;
		$expediente->Uni_clave = $unidad;
		$expediente->Usu_registro = Input::get('usuario');
		$expediente->Exp_paterno = $apaterno;
		$expediente->Exp_materno  = $amaterno;
		$expediente->Exp_nombre = $nombre;
		$expediente->Exp_completo = $nombreCompleto;
		$expediente->Exp_fechaNac = Input::get('fechaNac');
		$expediente->Exp_fechaNac2 = Input::get('fechaNac');
		$expediente->Exp_edad = $anios;
		$expediente->Exp_meses = $meses;
		$expediente->Exp_mail = Input::get('email');
		$expediente->Exp_tipoTel = $tipoTel;
		$expediente->Exp_telefono= $telefono;
		$expediente->Exp_codPostal= Input::get('cp');
		$expediente->Exp_fecreg = $fechaRegistro;
		$expediente->Cia_clave = Input::get('cliente');
		$expediente->Pro_clave = Input::get('producto');
		$expediente->Uni_claveActual = $unidad;
		$expediente->save();

		$archivo = $this->generaCodigo($folio);
		$telefonos = Input::get('telefonos');	
			
		$i = 1;

		foreach ($telefonos as $dato) {

			$tel = new TelefonosLesionado;
			$tel->Exp_folio = $folio;
			$tel->Tel_tipo = $dato['tipo'];
			$tel->Tel_numero = $dato['telefono'];
			$tel->Tel_cont = $i;
			$tel->save();

			$i++;

		}

		return Response::json(array('respuesta' => 'Registro Generado Correctamente','codigo' => $archivo, 'folio' => $folio, 'registro' => $fechaRegistro,'telefono' => $telefono));

	}


	public function registraSiniestro(){
	
		$cliente = Input::get('cliente');
		$poliza = Input::get('poliza');
		$orden = Input::get('orden');
		$folio = Input::get('folio');

		if( $cliente == 19 ){
	        $poliza = trim($poliza);
	        $cont = strlen($poliza);
	        if($cont<10){
	            $tope= 10-$cont;    
	            for($i=1;$i<=$tope;$i++){
	                $poliza='0'.$poliza;      
            	}
	        }
	    }

	    if(!$orden){
	        $orden='--';
	    }

	    if (! Input::has('ajustadorId') ) {

	    	$ajustador = new Ajustador;

	    	$ajustador->AJU_activo = 1;
	    	$ajustador->EMP_claveint = Input::get('cliente');
	    	$ajustador->LOC_claveint = Input::get('localidad');
	    	$ajustador->AJU_clavease = Input::get('cveAjustador');
	    	$ajustador->AJU_nombre = Input::get('ajustador');
	    	$ajustador->AJU_tel = Input::get('telAjustador');
	    	$ajustador->save();

	    	$ajustadorMV = $ajustador->AJU_claveint;

	    }else{
	    	$ajustadorMV = Input::get('cveAjustadorMv');
	    }

	    $expediente = Expediente::find($folio);

	    $expediente->Exp_poliza = $poliza;
        $expediente->Exp_siniestro = Input::get('siniestro');
        $expediente->Exp_reporte = Input::get('reporte');
        $expediente->Exp_RegCompania = Input::get('folioElec');
        $expediente->Exp_obs = Input::get('observaciones');
        $expediente->RIE_clave = Input::get('riesgo');
        $expediente->Exp_inciso = Input::get('inciso');
        $expediente->Exp_folPase = Input::get('folioPase');
        $expediente->Exp_ajustador = Input::get('ajustador');
        $expediente->Exp_cveAjustador = Input::get('cveAjustador');
        $expediente->Exp_cveAjustadorMV = $ajustadorMV;
        $expediente->Exp_telAjustador = Input::get('telAjustador');
        $expediente->Exp_deducible = Input::get('deducible');
        $expediente->Exp_obsDeducible = Input::get('observacionesDeducible');
        $expediente->Exp_orden = $orden;
        $expediente->Exp_bitacora = Input::get('bitacora');
		$expediente->Exp_triageOrigen = 1;
        $expediente->Exp_triageActual = 1;
        $expediente->save();

		return Response::json(array('respuesta' => 'Registro Generado Correctamente'));

	}

	public function verificaDuplicado(){

		$apaterno = Input::get('apaterno');
		$amaterno = Input::get('amaterno');
		$nombre = Input::get('nombre');
		$cliente = Input::get('cliente');
		$unidad = Input::get('unidad');
		$fechaNac = Input::get('fechaNac');

		$parametros = array(
			'Exp_paterno' => $apaterno,
			'Exp_materno' => $amaterno,
			'Exp_nombre'  => $nombre,
			'Exp_fechaNac2'  => $fechaNac,
			'Cia_clave'   => $cliente,
			'Uni_clave'   => $unidad
		);

		return Expediente::where($parametros)->first();

	}

	// Funciones privadas para uso exclusivo del controlador
	private	function calculaEdad($fechaNac){

		$fecha_de_nacimiento = $fechaNac; 
		$fecha_actual = date ("Y-m-d"); 


		// separamos en partes las fechas 
		$array_nacimiento = explode ( "-", $fecha_de_nacimiento ); 
		$array_actual = explode ( "-", $fecha_actual ); 

		$anos =  $array_actual[0] - $array_nacimiento[0]; // calculamos años 
		$meses = $array_actual[1] - $array_nacimiento[1]; // calculamos meses 
		$dias =  $array_actual[2] - $array_nacimiento[2]; // calculamos días 

		//ajuste de posible negativo en $días 
		if ($dias < 0) { 

			--$meses; 

				//ahora hay que sumar a $dias los dias que tiene el mes anterior de la fecha actual 
			switch ($array_actual[1]) { 

				   case 1: $dias_mes_anterior=31; break; 
				   case 2: $dias_mes_anterior=31; break; 
				   case 3:  
						if (bisiesto($array_actual[0])) 
						{ 
							$dias_mes_anterior=29; break; 
						} else { 
							$dias_mes_anterior=28; break; 
						} 
				   case 4:     $dias_mes_anterior=31; break; 
				   case 5:     $dias_mes_anterior=30; break; 
				   case 6:     $dias_mes_anterior=31; break; 
				   case 7:     $dias_mes_anterior=30; break; 
				   case 8:     $dias_mes_anterior=31; break; 
				   case 9:     $dias_mes_anterior=31; break; 
				   case 10:     $dias_mes_anterior=30; break; 
				   case 11:     $dias_mes_anterior=31; break; 
				   case 12:     $dias_mes_anterior=30; break; 
			} 

			$dias = $dias + $dias_mes_anterior; 
		} 

		//ajuste de posible negativo en $meses 
		if ($meses < 0) 
		{ 
			--$anos; 
			$meses=$meses + 12; 
		}

		$edadCal = array(
			'anios' => $anos,
			'meses' => $meses
		);

		return $edadCal;
	}

	private function generaCodigo($folio){

    	try{ 

			$font = new BCGFont(10);

			// The arguments are R, G, B for color.
			$color_black = new BCGColor(0, 0, 0);
			$color_white = new BCGColor(255, 255, 255); 

			$code = new BCGcode39();
			$code->setScale(1); // Resolution
			$code->setThickness(30); // Thickness
			$code->setForegroundColor($color_black); // Color of bars
			$code->setBackgroundColor($color_white); // Color of spaces
			$code->setFont($font); // Font (or 0)
			$code->parse($folio); // Text



			/* Here is the list of the arguments
			1 - Filename (empty : display on screen)
			2 - Background color */
			$archivo = public_path() . '/codigos/'.$folio.'.png';
			$archivoTesteo = 'codigos/'.$folio.'.png';
			$drawing = new BCGDrawing($archivo, $color_white);
			$drawing->setBarcode($code);
			$drawing->draw();
			
			// Draw (or save) the image into PNG format.
			$drawing->finish(BCGDrawing::IMG_FORMAT_PNG);

			return $archivoTesteo;

		}catch(Exeption $e){
			echo $e;
		}
	}

	
}
