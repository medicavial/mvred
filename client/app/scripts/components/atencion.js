(function(){

	'use strict';

	angular
	.module('app')
	.component('atencion',{
		templateUrl:'views/atencion.html',
		controller: atencionCtrl,
		controllerAs:'atn',
		bindings: {
		   clave: '='
		}
	});

	atencionCtrl.$inject = ['$rootScope','mensajes','$mdDialog','operacion','busqueda','webStorage'];

	function atencionCtrl($rootScope,mensajes,$mdDialog,operacion,busqueda,webStorage){
		var atn = this;

		//al cargar el el componente se ejecuta la funcion inicio
		atn.$onInit = inicio;
		// atn.$onDestroy = destruccion;

		atn.cargaInfo = cargaInfo;
		atn.eliminarDigitales = eliminarDigitales;
		atn.lesionMV = lesionMV;
		atn.lesionCodificada = lesionCodificada;
		atn.motivo = motivo;
		atn.muestraArchivo = muestraArchivo;
		atn.subirDigitales = subirDigitales;
		atn.subirFactura = subirFactura;
		atn.solicitaAutorizacion = solicitaAutorizacion;

		function inicio(){

			atn.solicitando = false;
			cargaInfo();

			// if ( webStorage.local.has(atn.clave) ) {

			// 	var data = JSON.parse( webStorage.local.get(atn.clave) ); 
			// 	atn.datos = data.info;
			// 	atn.tiposDocumento = data.tipos;
			// 	atn.imagenes = data.imagenes;

			// }else{

			// }

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

		function cargaInfo(){
			atn.subiendoImagen = false;
			atn.cargando = true;
			atn.opacidad = {'opacity':0.3};
			busqueda.detalleAtencion(atn.clave).then(
				function (data){
					console.log(data);
					atn.datos = data.info;
					atn.tiposDocumento = data.tipos;
					atn.imagenes = data.imagenes;
					atn.cargando = false;
					atn.anotaciones = data.anotaciones;
					atn.requisitos = data.requisitos;
					atn.lesiones = data.lesiones;
					atn.opacidad = {};
				},
				function (error){
					mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
					atn.cargando = false;
					atn.opacidad = {};
				}
			);
		
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
				operacion.subirFactura(files,atn.clave).then(
					function (datos){

						atn.subiendoImagen = false;
						console.log(datos);
						mensajes.alerta('Factura subida correctamente','success','top right','done_all');
						
						// atn.facturas.push(datos);						
						// atn.porcentaje = '';
						// atn.tipo = '';
						// atn.files = [];
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
		}

		function eliminarDigitales(file,ev){

			var confirm = $mdDialog.confirm()
				.title('Deseas eliminar este archivo?')
				.textContent('')
				.ariaLabel('¿Deseas eliminar imagen?')
				.targetEvent(ev)
				.ok('SI')
				.cancel('NO');

				
		    $mdDialog.show(confirm).then(function() {
		      	
		      	file.usuario = $rootScope.id;
		      	file.atencion = atn.clave;
		      	
				operacion.eliminaImagen(file).then(
					function (resp){
						
						atn.datos.ATN_estatus = 0;
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
				templateUrl: 'views/visor.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals:{imagen:imagen},
				fullscreen: true,
				controller: 'visorCtrl'
		    });

		}
	}

})();