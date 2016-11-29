(function(){

	'use strict';
	
	angular.module('app')
	.controller('solicitudAutorizacionCtrl',solicitudAutorizacionCtrl)

	solicitudAutorizacionCtrl.$inject = ['datos', 'operacion', 'mensajes', '$rootScope','$mdDialog'];

	function solicitudAutorizacionCtrl(datos, operacion, mensajes,  $rootScope,$mdDialog){
		

		var sol = this;
		
		sol.titulo = 'Solicitud de Autorización';

		sol.inicio = inicio;
		sol.mensaje = mensaje;
		sol.siguiente = siguiente;
		sol.subirDigitales = subirDigitales;
		sol.eliminaImagen = eliminaImagen;
		sol.solicitar = solicitar;
		sol.cancelar = cancelar;

		function cancelar(){
			$mdDialog.cancel();
		}

		function inicio(){

			sol.files = [];
			sol.documentos = [];
			sol.nombredoc = '';
			sol.mensaje = '';
			sol.clavesolicitud = '';
			sol.folio = datos.Exp_folio;

			sol.tabActual = 0;
			sol.step1block = false;
			sol.step2block = true;
			sol.step3block = true;
			sol.step4block = true;
			sol.step5block = true;

			sol.paso1 = 'solicitudPaso1.html';
			sol.paso2 = 'solicitudPaso2.html';


			sol.datos = {
				usuario:$rootScope.id,
				folio:datos.Exp_folio,
				lesionado:datos.Exp_completo,
				tipo:'',
				cliente:datos.Cia_clave,
				clientenombre:datos.Cia_nombrecorto,
				interconsulta:{
					tipo:'',
					embarazo:'',
					controlgineco:'NO',
					semanas:4,
					dolorabdominal:'NO',
					frecuencia:'',
					movimientosfetales:'',
					observaciones:''	
				},
				estudio:{
					tipo:'',
					detalle:''
				},
				rehabilitacion:{
					dolor:0,
					rehabilitaciones:0,
					mejora:0
				},
				suministro:{
					detalle:''
				},
				informacion:{
					notamedica:false,
					rx:false,
					resultados:false,
					detalle:''
				},
				salidapaquete:{
					detalle:''
				},
				problemadocumental:{
					pase:false,
					identificacion:false,
					detalle:''
				},
				diagnostico:'',
				justificacion:'',
				soporte:sol.documentos
			}

			sol.ultimo = 'Lesionado';

			sol.index = 0;
			sol.buscar = false;
			sol.tiposDocumentos = datos.data;

		}

		function mensaje(){

			sol.tipo = false;


			var valor = sol.datos.tipo;


			switch(valor){
				case "4":
			        sol.mensajetipo = 'Te recordamos que dentro del paquete pactado está incluida la atención inicial y subsecuente por médico traumatólogo o urgenciólogo. Así como también la consulta de valoración por médico de cualquier otra especialidad, en caso de requerir tratamiento de una especialidad distinta a Traumatología y Ortopedia por favor solicita una salida de paquete.';
			        sol.tipo = true;
			        break;
			    case "3":
			        sol.mensajetipo = 'Te recordamos que los Rx están conveniados dentro del paquete.';
			        sol.tipo = true;
			        break;
			    case "1":
			    	sol.mensajetipo = 'Según su lesión y siguiendo el criterio y las indicaciones del médico tratante es recomendable proporcionarle al lesionado ejercicio para realizar por su cuenta. Aunado a lo anterior les recordamos que las primeras cinco sesiones de rehabilitación están previamente convenidas dentro del paquete.';
			    	sol.tipo = true;
			    	break;
			    case "9":
			    	sol.mensajetipo = 'Pendiente';
			    	sol.tipo = true;
			    	break;
			    case "11":
			    	sol.mensajetipo = 'La coordinación médica es quien dictaminará, en su caso, la entrega o rechazo de informes médicos y estudios a los pacientes, de acuerdo a las indicaciones de cada compañía de seguros.';
			    	sol.tipo = true;
			    	break;
			   	case "21":
			    	sol.mensajetipo = 'Se debe solicitar salida de paquete cuando el tratamiento amerite periodo de tiempo en corta estancia, observación, hospitalización o procedimientos quirúrgicos, terapia intermedia o intensiva.';
			    	sol.tipo = true;
			    	break;
			    case "2":
			    	sol.mensajetipo = 'Pendiente';
			    	sol.tipo = true;
			    	break;
			    default:
			    	sol.mensajetipo = '';
			    	sol.tipo = false;

			}

		}

		function siguiente(){
			
			// console.log(sol.tabActual);

			if (sol.tabActual == 0 && sol.datos.tipo != '') {
				sol.step2block = false;
				sol.tabActual++;
				
			}else if(sol.tabActual == 1){
				sol.step3block = false;
				sol.tabActual++;
			}else if(sol.tabActual == 2){
				sol.step4block = false;
				sol.tabActual++;
			}else if(sol.tabActual == 3){
				sol.step5block = false;
				sol.tabActual++;
			}

		}

		function solicitar() {

			sol.guardando = true;
	        operacion.ingresaSolicitud(sol.datos).success(function (data){
	        	sol.guardando = false;
	        	mensajes.alerta('Datos Guardados Correctamente','success','top right','done_all');
	        	$mdDialog.hide(data);
	        }).error(function (error){
	        	mensajes.alerta('Ocurrio un error intentalo nuevamente','error','top right','error');
	        	sol.guardando = false;
	        });

	    }


	    function subirDigitales(file,ev){


			if (files.length > 0) {

				atn.subiendoImagen = true;
				operacion.subirImagenesSolicitud(files).then(
					function (datos){

						atn.imagenes.push(datos);						
						mensajes.alerta('Imagen subida correctamente','success','top right','done_all');
						atn.porcentaje = '';
						atn.subiendoImagen = false;
						atn.tipo = '';
						atn.files = [];
					},	
					function (error){
						mensajes.alerta(error,'error','top right','error');
						atn.porcentaje = '';
						atn.subiendoImagen = false;
					},
					function (porcentaje){
						// console.log(porcentaje);
						atn.porcentaje = porcentaje;
					}
				)

			};

		}

		function eliminaImagen(index){
			sol.documentos.splice(index,1);
		}

	}

})();