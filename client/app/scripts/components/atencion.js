(function(){

	'use strict';

	angular
	.module('app')
	.component('atencion',{
		templateUrl:'atencion.html',
		controller: atencionCtrl,
		controllerAs:'atn',
		bindings: {
		   clave: '='
		}
	});

	atencionCtrl.$inject = ['$rootScope','mensajes','$mdDialog','operacion','busqueda','webStorage', 'filtro'];

	function atencionCtrl($rootScope,mensajes,$mdDialog,operacion,busqueda,webStorage, filtro){
		var atn = this;

		atn.permisos = $rootScope.permisos;

		//al cargar el el componente se ejecuta la funcion inicio
		atn.$onInit = inicio;
		// atn.$onDestroy = destruccion;

		atn.autorizarImagen = autorizarImagen;
		atn.cargaInfo = cargaInfo;
		atn.descargaArchivo = descargaArchivo;
		atn.eliminarArchivos = eliminarArchivos;
		atn.eliminaFactura = eliminaFactura;
		atn.guardaNotas = guardaNotas;
		atn.lesionMV = lesionMV;
		atn.lesionCodificada = lesionCodificada;
		atn.motivo = motivo;
		atn.muestraArchivo = muestraArchivo;
		atn.subirDigitales = subirDigitales;
		atn.subirFactura = subirFactura;
		atn.solicitaAutorizacion = solicitaAutorizacion;
		atn.solicitaRevisionFactura = solicitaRevisionFactura;


		function autorizarImagen(imagen){

			imagen.usuario = $rootScope.id;
			
			operacion.autorizaImagen(imagen,atn.clave).then(function (res){
				mensajes.alerta(res.data.flash,'success','top right','done_all');
				cargaInfo();
			},function (err){
				mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
			});
		}

		function inicio(){

			atn.solicitando = false;
			cargaInfo();

		}

		function destruccion(){
			var datos = {
				info : atn.datos,
				tipos : atn.tiposDocumento,
				anotaciones : atn.anotaciones,
				requisitos : atn.requisitos,
				imagenes : atn.imagenes
			}

			webStorage.local.add( atn.clave, JSON.stringify(datos) );

		}

		function descargaArchivo(imagen){

			operacion.descargaArchivo(imagen.archivo + '/' + imagen.clave);

		}

		function cargaInfo(){
			atn.subiendoImagen = false;
			atn.cargando = true;
			atn.opacidad = {'opacity':0.3};
			busqueda.detalleAtencion(atn.clave).then(
				function (data){
					atn.datos = data.info;
					atn.tiposDocumento = data.tipos;
					atn.imagenes = data.imagenes;
					atn.cargando = false;
					atn.eliminandoXML = false;
					atn.eliminandoPDF = false;
					atn.anotaciones = data.anotaciones;
					atn.requisitos = data.requisitos;
					atn.lesiones = data.lesiones;
					atn.pdf = data.pdf == null ? false:true;
					atn.xml = data.xml == null ? false:true;
					atn.archivoPDF = data.pdf;
					atn.archivoXML = data.xml;
					atn.xmlData = data.factura; 
					atn.opacidad = {};
					console.log(atn.pdf);
					console.log(atn.xml);
				},
				function (error){
					mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
					atn.cargando = false;
					atn.opacidad = {};
				}
			);
		
		}

		function guardaNotas(){
			operacion.guardaNotas(atn.datos.ATN_mensaje,atn.clave).then(function (resp){
				mensajes.alerta(resp.data.flash,'success','top right','done_all');
			},function (err){
				mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
			});	
		}

		function lesionMV(){
			
			busqueda.lesionMV(atn.tipoLes).success(function (data){
				atn.lesionesMV = data;
			})

		}

		function lesionCodificada(){
			
			busqueda.lesionCodificada(atn.lesionMV).success(function (data){
				atn.lesionesCod = data;
			})

		}

		function subirDigitales(files,tipo,ev){

			if (files.length > 0) {

				atn.subiendoImagen = true;
				operacion.subirImagenes(tipo,files,atn.clave).then(
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

		function subirFactura(files,ev){

			if (files.length > 0) {

				atn.subiendoImagen = true;
				operacion.subirFactura(files,atn.clave,atn.xml,atn.pdf).then(
					function (datos){

						console.log(datos);
						atn.subiendoImagen = false;
						mensajes.alerta('Factura subida correctamente','success','top right','done_all');
						
						if (datos.xml) {
							atn.xml = true;
							atn.archivoXML = datos.datosArchivo;
							validaPDF(datos.datosXML);
						}else{
							atn.pdf = true;
							atn.archivoPDF = datos.datosArchivo;
						};
					},	
					function (error){
						mensajes.alerta(error,'error','top right','error');
						atn.porcentaje = '';
						atn.subiendoImagen = false;
					}
				)

			};

		}

		function solicitaAutorizacion(){

			
			filtro.verificaRequeridos(atn.tiposDocumento,atn.imagenes).then(function (res){

				var datos = {
					atencion:atn.clave,
					usuario:$rootScope.id,
					requisitos: atn.anotaciones.length > 0 ? '':atn.requisitos,
					tipoLes:atn.tipoLes,
					lesionMV:atn.lesionMV,
					lesionCod:atn.lesionCod
				}

				atn.solicitando = true;

				operacion.solicitaAutorizacion(datos).success(function (data){
					atn.datos.ATN_estatus = 1;
					atn.solicitando = false;
					mensajes.alerta(data.respuesta,'success','top right','done_all');
				}).error(function (error){
					atn.solicitando = false;
					mensajes.alerta('Ocurrio un error vuelve a intentarlo por favor','error','top right','error');
				})
				
			},function (err){

				mensajes.alerta('Faltan ' + err + ' imagene(s) por subir','error','top right','error');

			});
			

		}

		function solicitaRevisionFactura(){

			atn.solicitando = true;

			operacion.cambiarEstatus(atn.clave,5).success(function (data){
				atn.datos.ATN_estatus = 5;
				atn.solicitando = false;
				mensajes.alerta(data.respuesta,'success','top right','done_all');
			}).error(function (error){
				atn.solicitando = false;
				mensajes.alerta('Ocurrio un error vuelve a intentarlo por favor','error','top right','error');
			})
		}

		function eliminarArchivos(file,ev,historico,estatus,respaldo){

			console.log(historico,estatus,respaldo);

			historico = historico == undefined ? true : historico;
			estatus = estatus == undefined ? true : estatus;
			respaldo = respaldo == undefined ? true : respaldo;

			var confirm = $mdDialog.confirm()
				.title('Deseas eliminar este archivo?')
				.textContent('')
				.ariaLabel('¿Deseas eliminar archivo?')
				.targetEvent(ev)
				.ok('SI')
				.cancel('NO');

				
		    $mdDialog.show(confirm).then(function() {
		      	
		      	file.usuario = $rootScope.id;
		      	file.atencion = atn.clave;
		      	file.historico = historico;
		      	file.cambiarEstatus = estatus;
		      	file.respaldo = respaldo;

		      	// console.log(file);
		      	
				operacion.eliminaArchivo(file).then(
					function (resp){
						
						if (estatus) {
							atn.datos.ATN_estatus = 0;							
						};
						mensajes.alerta(resp.data.flash,'success','top right','done_all');
						
						var index = atn.imagenes.indexOf(file);
						atn.imagenes.splice(index, 1);

					},	
					function (error){
						mensajes.alerta(error,'error','top right','error');
					}
				)

		    });
			
		}

		function eliminaFactura(file,tipo,ev){

			var confirm = $mdDialog.confirm()
				.title('Deseas eliminar este archivo?')
				.textContent('')
				.ariaLabel('¿Deseas eliminar archivo?')
				.targetEvent(ev)
				.ok('SI')
				.cancel('NO');

				
		    $mdDialog.show(confirm).then(function() {
		      	
				file.usuario = $rootScope.id;
		      	file.atencion = atn.clave;
		      	file.historico = true;
		      	file.cambiarEstatus = false;
		      	file.respaldo = false;

		      	if (tipo == 'xml') {
					file.tipo = 29;	
					atn.eliminandoXML = true;				
				}else{
					file.tipo = 30;					
					atn.eliminandoPDF = true;				
				}


				console.log(file);
				operacion.eliminaArchivo(file).then(
					function (resp){
						if (tipo == 'xml') {
							atn.archivoXML = '';
							atn.xml = false;						
						}else{
							atn.archivoPDF = '';
							atn.pdf = false;
						}

						mensajes.alerta( tipo + ' eliminado','','top right','done');


					},	
					function (error){
						mensajes.alerta(error,'error','top right','error');
					}
				)
		    	
		    });

		}

		function motivo(motivo,ev){
			var alert = $mdDialog.alert()
				.title('Motivo de rechazo')
				.textContent(motivo)
				.ariaLabel('Motivo de rechazo')
				.targetEvent(ev)
				.ok('Cerrar');

		    $mdDialog.show(alert);
		
		}

		function muestraArchivo(imagen,ev){

			$mdDialog.show({
				templateUrl: 'visor.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals:{imagen:imagen},
				fullscreen: true,
				controller: 'visorCtrl'
		    });

		}

		function validaPDF(datos){

			if ('hola' == atn.datosXML.Comprobante.Receptor._rfc){

                // atn.facturaaRfc(datos.Comprobante.Receptor._rfc);
                atn.factura.foliofiscal = datos.Comprobante.Complemento.TimbreFiscalDigital._UUID;
                atn.factura.receptor = datos.Comprobante.Receptor._nombre;
                atn.factura.rfc = datos.Comprobante.Receptor._rfc;
                atn.factura.emisor = datos.Comprobante.Emisor._nombre;
                atn.factura.rfc_emisor = datos.Comprobante.Emisor._rfc;
                atn.factura.subtotal = datos.Comprobante._subTotal;
                atn.factura.iva = datos.Comprobante.Impuestos.Traslados.Traslado._importe;
                atn.factura.total = datos.Comprobante._total;
                atn.factura.descuento = datos.Comprobante._descuento;
                atn.factura.fechaemision = datos.Comprobante._fecha;
                atn.factura.tipocomprobante = datos.Comprobante._tipoDeComprobante;
                atn.factura.lugarexpedicion = datos.Comprobante._LugarExpedicion;
              
            }else{

            	eliminaFactrua(atn.archivoXML,'',false,false);

            	mensajes.alerta('Tu Factura no coincide con Receptor','error','top right','error');
            }

		}
	}

})();