<?php

class OperacionController extends BaseController {

	private $rutaImagen;
	private $rutaArchivos;
	//funciones de las rutas


	public function __construct()
	{
		$this->rutaArchivos = '../registro/';
	    // $this->rutaArchivos = public_path().'../../../../registro/';
	}

	//creamos una nueva atencion
	public function creaAtencion(){

		$tipoAtn = Input::get('tipoAtn');
		$folio = Input::get('folio');
		$consecutivo = Input::get('consecutivo');
		
		//guardamos los datos de la atencion
		$atencion = new Atencion;

		$atencion->Exp_folio = $folio;
		$atencion->TIA_clave = $tipoAtn;
		$atencion->ATN_cons = $consecutivo;
		$atencion->ATN_estatus = 0;
		$atencion->ATN_fecReg = date('Y-m-d H:i:s');
		$atencion->save();

		$claveAtencion = $atencion->ATN_clave;


		$producto = Expediente::find($folio)->Pro_clave;

		//preparamos los documentos necesarios para esta atencion
		$documentosNecesarios = AtencionDocumento::where( array( 'Pro_clave' => $producto,'TIA_clave' => $tipoAtn, 'ATD_requerido' => 1 ) )->get();

		foreach ($documentosNecesarios as $documento) {

			//registramos la atencion y los documentos que necesita para ser cobrado
			$documentoNecesario = new AtencionTipoDocumento;
			$documentoNecesario->ATN_clave = $claveAtencion;
			$documentoNecesario->TID_clave = $documento['TID_clave'];
			$documentoNecesario->save();

		}

		return Atencion::find($claveAtencion);
	
	}

	//funcion para guardar la relacion entre producto , tipo atencion y documentos
	public function documentos(){

		$producto = Input::get('producto');
		$atencion = Input::get('atencion');
		$documentos  = Input::get('documentos');

		foreach ($documentos as $documento) {

			$claveDoc = $documento['TID_claveint'];

			$atencionDoc = new AtencionDocumento;
			$atencionDoc->Pro_clave = $producto;
			$atencionDoc->TIA_clave = $atencion;
			$atencionDoc->TID_clave = $claveDoc;
			$atencionDoc->save();

		}

		return Response::json(array('flash' => 'Datos Guardados'));
		
	}


	//funcion para elminar Archivos ya sean imagenes o pdf/xml
	public function eliminaArchivo(){

		$atencion = Input::get('atencion');
		$clave = Input::get('clave');
		$tipo  = Input::get('tipo');
		$archivo = Input::get('archivo');
		$usuario = Input::get('usuario');

		//estos son manejadores para las facturas
		$historico = Input::get('historico');
		$estatus = Input::get('cambiarEstatus');

		//generamos la ruta a eliminar 
		$archivo = $this->rutaArchivos . $archivo . '/' .$clave;

		// lo eliminamos
		File::delete($archivo);

		// eliminamos registro en base de datos
		Imagenes::where( array('Arc_clave' => $clave, 'Arc_tipo' => $tipo, 'ATN_clave' => $atencion) )->delete();

		//info para actualizar el estatus general del documento y generar historial
		$tipoNombre = tipoDocumentos::find($tipo)->TID_nombre;
		$atn = Atencion::find($atencion);

		if ($historico) {
			//guardamos el historico
			$Historico = new Historico;
			$Historico->usuario = $usuario;
			$Historico->titulo = 'Se eliminó imagen : ' . $tipoNombre;
			$Historico->descripcion = 'Se eliminó imagen del folio  por el usuario ' . $usuario;
			$Historico->folio = $atn->Exp_folio;
			$Historico->etapa = $atn->TIA_clave;
			$Historico->entrega = $atn->ATN_cons;
			$Historico->guardar();
		}


		if ($estatus) {
			
			//actualizamos el estatus de la atencion 
			$atn->ATN_estatus = 0;
			$atn->save();


			//actualizamos el estatus del documento en la atencion en caso de ser un tipo de documento requerido
			$tipoDocumento = AtencionTipoDocumento::where( array('ATN_clave' => $atencion, 'TID_clave' => $tipo) );
			if ($tipoDocumento->count() > 0) {
				$tipoDocumento->update(array('ATD_estatus' => 0,'ATD_motivo' => ''));
			}
		}

		return Response::json(array('flash' => 'Archivo eliminado'));
		
	}

	//funcion para subir factura XML
	public function factura(){

		$usuario = Input::get('usuario');
		$atencion = Input::get('atencion');
		$tipo = Input::get('tipo');

		$atn = Atencion::find($atencion);
		$tipoAtn = $atn->TIA_clave;
		$folio = $atn->Exp_folio;

		$archivos = Imagenes::where( array('Arc_tipo' => $tipo , 'ATN_clave' => $atencion) )->count();

		$ruta = $this->verificaRuta($folio,$tipo,$tipoAtn);

        if(Input::hasFile('file')) {

        	//preparamos la constante de la imagen del folio
			$consecutivo = Imagenes::where('REG_folio',$folio)->max('Arc_cons') + 1;

			// prefijo segun el tipo de imagen
	        $prefijo = tipoDocumentos::find($tipo)->TID_prefijo;

        	//seleccionamos archivo
            $file = Input::file('file');

            //preparamos nombre del archivo
        	$nombreArchivo = $consecutivo."_".$prefijo."_".$folio.".". $file->getClientOriginalExtension();

        	$imagen = new Imagenes;

        	$imagen->Arc_cons = $consecutivo;
        	$imagen->Arc_clave = $nombreArchivo;
        	$imagen->REG_folio = $folio;
        	$imagen->Arc_archivo = $this->rutaImagen;
        	$imagen->Arc_tipo = $tipo;
        	$imagen->Arc_desde = 'REGISTRO_RED';
        	$imagen->USU_login = $usuario;
        	$imagen->Arc_fecreg = date('Y-m-d H:i:s');
        	$imagen->ATN_clave = $atencion;
        	$imagen->save();
            
            $file->move($ruta,$nombreArchivo);

            $tipoNombre = tipoDocumentos::find($tipo)->TID_nombre;
            $tipoAtnNombre = TipoAtencion::find($tipoAtn)->TIA_nombre;

			$Historico = new Historico;
			$Historico->usuario = $usuario;
			$Historico->titulo = 'Se ingresó : ' . $tipoNombre . ' de la atención';
			$Historico->descripcion = 'Se ingresó ' . $tipoNombre . ' del folio para ' . $tipoAtnNombre . ' por el usuario ' . $usuario;
			$Historico->folio = $folio;
			$Historico->etapa = $tipoAtn;
			$Historico->entrega = $atn->ATN_cons;
			$Historico->guardar();

			$archivo =  $ruta . '/' .  $nombreArchivo;

			$imagen = Imagenes::imagen($folio,$tipo,$consecutivo);
		
			$contenido =  file_get_contents($archivo);

			return Response::json(array('archivo' => $imagen, 'contenido' => $contenido, 'ubicacion' => $archivo));

        }else{

        	return Response::json(array('flash' => 'XML no valido'),500);

        }

	}

	public function muestraXML($atencion){

		$xml = Imagenes::where(array('ATN_clave' => $atencion,'Arc_tipo' => 29))->first();
		$archivo = $this->rutaArchivos . $xml->Arc_archivo . '/' . $xml->Arc_clave;
		return file_get_contents($archivo);
		
	}


	// funcion para generar la portada del folio
	public function generaPortada($folio){

		Accion::generaPortada($folio);

	}

	//funcion para subir imagenes de la atencion
	public function imagenes(){

		$tipo = Input::get('tipo');
		$usuario = Input::get('usuario');
		$atencion = Input::get('atencion');

		$atn = Atencion::find($atencion);
		$folio = $atn->Exp_folio;
		$tipoAtn = $atn->TIA_clave;

		$archivos = Imagenes::where( array('Arc_tipo' => $tipo , 'ATN_clave' => $atencion) )->count();

		$ruta = $this->verificaRuta($folio,$tipo,$tipoAtn);

		if ( ($tipo == 1 || $tipo == 15 || $tipo == 16 || $tipo == 26) && $archivos > 0 ) {

			return Response::json(array('flash' => 'No puedes subir mas de un archivo de este tipo, elimina el que tienes para subir nuevamente'),500);

		}else{



	        if(Input::hasFile('file')) {

	        	//preparamos la constante de la imagen del folio
				$consecutivo = Imagenes::where('REG_folio',$folio)->max('Arc_cons') + 1;

				// prefijo segun el tipo de imagen
	        	$prefijo = tipoDocumentos::find($tipo)->TID_prefijo;

	        	//seleccionamos archivo
	            $file = Input::file('file');

	            //preparamos nombre del archivo
	        	$nombreArchivo = $consecutivo."_".$prefijo."_".$folio.".". $file->getClientOriginalExtension();

	        	$imagen = new Imagenes;

	        	$imagen->Arc_cons = $consecutivo;
	        	$imagen->Arc_clave = $nombreArchivo;
	        	$imagen->REG_folio = $folio;
	        	$imagen->Arc_archivo = $this->rutaImagen;
	        	$imagen->Arc_tipo = $tipo;
	        	$imagen->Arc_desde = 'REGISTRO_RED';
	        	$imagen->USU_login = $usuario;
	        	$imagen->Arc_fecreg = date('Y-m-d H:i:s');
	        	$imagen->ATN_clave = $atencion;
	        	$imagen->save();
	            
	            $file->move($ruta,$nombreArchivo);


	            $tipoNombre = tipoDocumentos::find($tipo)->TID_nombre;
	            $tipoAtnNombre = TipoAtencion::find($tipoAtn)->TIA_nombre;

				$Historico = new Historico;
				$Historico->usuario = $usuario;
				$Historico->titulo = 'Se ingresó imagen : ' . $tipoNombre;
				$Historico->descripcion = 'Se ingresó imagen del folio para ' . $tipoAtnNombre . ' por el usuario ' . $usuario;
				$Historico->folio = $folio;
				$Historico->etapa = $tipoAtn;
				$Historico->entrega = $atn->ATN_cons;
				$Historico->guardar();

				$imagen = Imagenes::imagen($folio,$tipo,$consecutivo);

				$tipo = $imagen['tipo'];

				$atencionDocumento = AtencionTipoDocumento::where( array('ATN_clave' => $atencion, 'TID_clave' => $tipo) )->first();

				if ( count($atencionDocumento) > 0 ) {

					$imagen['estatusGlobal'] = $atencionDocumento->ATD_estatus;
					$imagen['estatusGlobalIcon'] = 'check_box_outline_blank';	

				}else{
					$imagen['estatusGlobal'] = 0;
					$imagen['estatusGlobalIcon'] = 'folder';
				}

				return $imagen;

	        }else{

	        	return Response::json(array('flash' => 'Imagen no valida'),500);

	        }
	        
		}


	}

	//se registra los datos del lesionado y se asigna folio
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

		$usuario = Input::get('usuario');

		$expediente = new Expediente;
		$expediente->Exp_folio = $folio;
		$expediente->Exp_prefijo = $prefijo;
		$expediente->Exp_cons = $consecutivo;
		$expediente->Uni_clave = $unidad;
		$expediente->Usu_registro = $usuario;
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
		$expediente->Exp_fq = Input::get('folioInterno');
		$expediente->Uni_claveActual = $unidad;
		$expediente->Exp_FE = 1;
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

		$Historico = new Historico;
		$Historico->usuario = $usuario;
		$Historico->titulo = 'Registro de Expediente';
		$Historico->descripcion = 'Se registro el paciente ' . $nombreCompleto . ' por el usuario ' . $usuario;
		$Historico->folio = $folio;
		$Historico->etapa = 1;
		$Historico->entrega = 1;
		$Historico->guardar();


		return Response::json(array('respuesta' => 'Registro Generado Correctamente','codigo' => $archivo, 'folio' => $folio, 'registro' => $fechaRegistro,'telefono' => $telefono));

	}

	// se registra datos del siniestro pasando el folio y se actualiza
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

	    	//se gusrda en caso de que haya modificado el telefono
	    	$ajustador = Ajustador::find($ajustadorMV);
	    	$ajustador->AJU_tel = Input::get('telAjustador');
	    	$ajustador->save();
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
        $expediente->Exp_extemporaneo = Input::get('extemporaneo');
        $expediente->Exp_motivo = Input::get('motivoEx');
        $expediente->Exp_fecPaseMed = Input::get('fechaExp');
        $expediente->Exp_fechaAtn = Input::has('fechaAtencion') ? Input::get('fechaAtencion') : date('Y-m-d H:i:s');
        $expediente->save();

		return Response::json(array('respuesta' => 'Registro Generado Correctamente'));

	}

	// se solicita la revision de os documentos
	public function solicitaAutorizacion(){
		
		$atencion = Input::get('atencion');
		$usuario = Input::get('usuario');
		
		$atn = Atencion::find($atencion);

		$folio = $atn->Exp_folio;
		$tipoAtn = $atn->TIA_clave;
		$entrega = $atn->ATN_cons;

		$atn->ATN_estatus = 1;
		$atn->save();

		// verificamos si hay requisitos por guardar
		if ( Input::has('requisitos') ) {

			$requisitos = Input::get('requisitos'); 
			foreach ($requisitos as $requisito) {
				
				$anotacion = new Anotacion;
				$anotacion->ATN_clave = $atencion;
				$anotacion->REQ_clave = $requisito['REQ_clave'];
				$anotacion->ANT_valor = $requisito['valor'];
				$anotacion->save();
			}
		}

		// si es primera atencion necesitamos registrar lesion
		if ($tipoAtn == 1) {

			//si aun no tenemos registro de lesiones en el expediente
			if ( ExpedienteLesion::where('Exp_folio',$folio)->count() == 0) {
				
				$tipoLes = Input::get('tipoLes');
				$lesionMV = Input::get('lesionMV');
				$lesionCod = Input::get('lesionCod');

				$expLesion = new ExpedienteLesion;
				$expLesion->Exp_folio = $folio;
				$expLesion->TLE_claveint = $tipoLes;
				$expLesion->LES_clave = $lesionMV;
				$expLesion->LCO_cve = $lesionCod;
				$expLesion->save();
			}

			$descripcion = 'El usuario ' . $usuario . ' solicitó revisión de documentos de la primera atención';

		}elseif ($tipoAtn == 2) {
			$descripcion = 'El usuario ' . $usuario . ' solicitó revisión de documentos de la Subsecuencia';
		}elseif ($tipoAtn == 3) {
			$descripcion = 'El usuario ' . $usuario . ' solicitó revisión de documentos de la Rehabilitación';
		}

		$Historico = new Historico;
		$Historico->usuario = $usuario;
		$Historico->titulo = 'Se solicitó autorizacion del expediente';
		$Historico->descripcion = $descripcion;
		$Historico->folio = $folio;
		$Historico->etapa = $tipoAtn;
		$Historico->entrega = $entrega;
		$Historico->guardar();

		return Response::json(array('respuesta' => 'El expediente se envio a solicitud de autorizacion'));

	}

	// se solicita cancelacion del folio
	public function solicitaCancelacion(){
		
		$usuario = Input::get('usuario');
		$folio = Input::get('folio');
		$claveMotivo = Input::get('motivoId');
		$motivo = Input::get('motivo');
		$folioSus = Input::get('folioSus');
		$observaciones = Input::get('observaciones');

		$mcancelado = TipoCancelacion::find($claveMotivo)->CAC_nombre;

		//verificamos si l folio tiene atenciones
		$atenciones = Atencion::where('Exp_folio',$folio)->count();

		$expediente = Expediente::find($folio);
		$expediente->Usu_cancelado = $usuario;
		$expediente->Exp_fcancelado = date('Y-m-d H:i:s');
		$expediente->Exp_mcancelado = $motivo;
		$expediente->Exp_cm = $observaciones;
		$expediente->Exp_motCancel = $mcancelado;
		$expediente->Exp_duplicado = $folioSus;

		//preguntamos si las atenciones son mayores a 0 si es verdadero no actualizamos el bit
		//en caso de ser 0 cancelamos directamente
		if ($atenciones > 0) {
			$expediente->Exp_solCancela = 1;
		}else{
			$expediente->Exp_cancelado = 1;
		}

		$expediente->save();


		// verificamos si hay requisitos por guardar
		$Historico = new Historico;
		$Historico->usuario = $usuario;
		$Historico->titulo = 'Se solicitó cancelación del expediente';
		$Historico->descripcion = 'El usuario ' . $usuario . ' solicitó cancelación del expediente';
		$Historico->folio = $folio;
		$Historico->etapa = 1;
		$Historico->entrega = 1;
		$Historico->guardar();

		if ($atenciones > 0) {
			$respuesta = 'La solicitud fue exitosa y esta en proceso de revision';
			$estatus = 'Solicitado';
		}else{
			$respuesta = 'El folio se canceló automaticamente sin problemas';
			$estatus = 'Cancelado';
		}

		return Response::json(array('respuesta' => $respuesta,'estatus' => $estatus));

	}

	//funcion para solicitar autorizacion a coordinacion medica
	public function solicitud(){

		//datos de folio
	    $usuario = Input::get('usuario');
	    $folio = Input::get('folio');
	    $lesionado = Input::get('lesionado');
	    $tipo = Input::get('tipo');
	    $cliente = Input::get('cliente');

	    $diagnostico = Input::get('diagnostico');
	    $justificacion = Input::get('justificacion');
	    
	    //interconsulta
	    $consultatipo = Input::get('interconsulta')['tipo'];
	    $embarazo = Input::get('interconsulta')['embarazo'];
	    $controlgineco = Input::get('interconsulta')['controlgineco'];
	    $semanas = Input::get('interconsulta')['semanas'];
	    $dolorabdominal = Input::get('interconsulta')['dolorabdominal'];
	    $frecuencia = Input::get('interconsulta')['frecuencia'];
	    $movimientosfetales = Input::get('interconsulta')['movimientosfetales'];
	    $consultaObs = Input::get('interconsulta')['observaciones'];

	    //estudio especial
	    $estudiotipo = Input::get('estudio')['tipo'];
	    $estudiodetalle = Input::get('estudio')['detalle'];

	    //rehabilitacion

	    $dolor = Input::get('rehabilitacion')['dolor'];
	    $rehabilitaciones = Input::get('rehabilitacion')['rehabilitaciones'];
	    $mejora = Input::get('rehabilitacion')['mejora'];

	    //suministro

	    $suministrodetalle = Input::get('suministro')['detalle'];

	    //informacion
	    $notamedica = Input::get('informacion')['notamedica'];
	    $rx = Input::get('informacion')['rx'];
	    $resultados = Input::get('informacion')['resultados'];
	    $infodetalle = Input::get('informacion')['detalle'];

	    //salida de paquete

	    $hospitalarioDetalle = Input::get('salidapaquete')['detalle'];

	    //problema documental

	    $pase = Input::get('problemadocumental')['pase'];
	    $identificacion = Input::get('problemadocumental')['identificacion'];
	    $docdetalle = Input::get('problemadocumental')['detalle'];

	    $primera = substr ($lesionado,0, 1); 
	    $ultima = substr ($lesionado,-1, 1); 

	    $clave = 'S'. $primera . $ultima . $this->generar_numero();

	    $archivos = Input::get('soporte');

	    $solicitud = new Solicitud;

	    $solicitud->SOL_claveint = $clave;
		$solicitud->TIM_claveint = $tipo;
		$solicitud->Exp_folio = $folio;
		$solicitud->SOL_lesionado = $lesionado;
		$solicitud->SOL_estatus = 1;
		$solicitud->SOL_fechaReg = date('Y-m-d H:i:s');;
		$solicitud->SOL_fechaActualiza = date('Y-m-d H:i:s');
		$solicitud->Usu_login = $usuario;
		$solicitud->Cia_clave = $cliente;
		$solicitud->save();

		$detalleSolicitud = new DetalleSolicitud;
		$detalleSolicitud->SOL_claveint = $clave;
		$detalleSolicitud->DES_diagnostico = $diagnostico;
		$detalleSolicitud->DES_justificacion = $justificacion;
		$detalleSolicitud->DES_intertipo = $consultatipo;
		$detalleSolicitud->DES_embarazo = $embarazo;
		$detalleSolicitud->DES_controlgineco = $controlgineco;
		$detalleSolicitud->DES_semanas   = $semanas;
		$detalleSolicitud->DES_dolorabdominal = $dolorabdominal;
		$detalleSolicitud->DES_frecuencia = $frecuencia;
		$detalleSolicitud->DES_movimientosfetales = $movimientosfetales;
		$detalleSolicitud->DES_embarazoObs = $consultaObs;
		$detalleSolicitud->DES_estudiotipo = $estudiotipo;
		$detalleSolicitud->DES_estudioDetalle = $estudiodetalle;
		$detalleSolicitud->DES_dolor = $dolor;
		$detalleSolicitud->DES_rehabilitaciones = $rehabilitaciones;
		$detalleSolicitud->DES_mejora = $mejora;
		$detalleSolicitud->DES_suministroDetalle = $suministrodetalle;
		$detalleSolicitud->DES_notamedica = $notamedica;
		$detalleSolicitud->DES_rx = $rx;
		$detalleSolicitud->DES_resultados = $resultados;
		$detalleSolicitud->DES_infoDetalle = $infodetalle;
		$detalleSolicitud->DES_hosDetalle = $hospitalarioDetalle;
		$detalleSolicitud->DES_pase = $pase;
		$detalleSolicitud->DES_identificacion = $identificacion;
		$detalleSolicitud->DES_documentalDetalle = $docdetalle;
		$detalleSolicitud->save();


		$Historico = new Historico;
		$Historico->usuario = $usuario;
		$Historico->titulo = 'Se Solicitó Autorizacion Médica del expediente';
		$Historico->descripcion = 'El usuario ' . $usuario . ' solicitó Autorización Médica del expediente con la clave ' . $clave;
		$Historico->folio = $folio;
		$Historico->etapa = 1;
		$Historico->entrega = 1;
		$Historico->guardar();


		return Solicitud::join('TipoMovimiento','TipoMovimiento.TIM_claveint','=','Solicitudes.TIM_claveint')->where('SOL_claveint',$clave)->first();


	}

	//se verifican duplicados acorde al nombre
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

	public function generaCodigo($folio){

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

	public function verificaRuta($folio,$tipo,$tipoAtn){

		$rutaPrincipal = $this->rutaArchivos .'Digitales';

		$fecha = Expediente::find($folio)->Exp_fecreg;

		$dia  = date( "d", strtotime($fecha) );
		$mes  = date( "F", strtotime($fecha) );
		$anio = date( "Y", strtotime($fecha) );

		// verificamos la existencia de la ruta
		$folderAnio  	= is_dir($rutaPrincipal ."/". $anio) ? $rutaPrincipal ."/". $anio : mkdir($rutaPrincipal ."/". $anio);
		$folderMes   	= is_dir($rutaPrincipal ."/". $anio ."/". $mes) ? $rutaPrincipal ."/". $anio ."/". $mes : mkdir($rutaPrincipal ."/". $anio ."/". $mes);
	    $folderFolio 	= is_dir($rutaPrincipal ."/". $anio ."/". $mes ."/". $folio) ? $rutaPrincipal ."/". $anio ."/". $mes ."/". $folio : mkdir($rutaPrincipal ."/". $anio ."/". $mes ."/". $folio);
	    $folderAtencion = is_dir($rutaPrincipal ."/". $anio ."/". $mes ."/". $folio) ? $rutaPrincipal ."/". $anio ."/". $mes ."/". $folio . "/" . $tipoAtn : mkdir($rutaPrincipal ."/". $anio ."/". $mes ."/". $folio . "/" . $tipoAtn);

	    $ruta = $rutaPrincipal ."/". $anio ."/". $mes ."/". $folio . "/" . $tipoAtn;

	    $this->rutaImagen = "Digitales/". $anio ."/". $mes ."/". $folio . "/" . $tipoAtn;

		return $ruta;

	}

	private function generar_numero(){ 

        $valor = '';

        $pares = '24680';
        $nones = '13579';
        $consonantes = "BCDEFGHIJKLMNOPQRSTUVWXYZ";
        $todos =  $pares . $consonantes . $nones;
       
        $valor .= substr($pares,rand(0,4),1);
        $valor .= substr($nones,rand(0,4),1);
        $valor .= substr($todos,rand(0,34),1);
        return $valor;

	} 

	
}
