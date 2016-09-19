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
		atn.$onDestroy = destruccion;

		atn.subirDigitales = subirDigitales;
		atn.solicitaAutorizacion = solicitaAutorizacion;
		atn.eliminarDigitales = eliminarDigitales;
		atn.motivo = motivo;
		atn.muestraArchivo = muestraArchivo;

		function inicio(){

			if ( webStorage.local.get(atn.clave) == undefined ) {

				atn.cargando = true;
				atn.opacidad = {'opacity':0.3};
				busqueda.detalleAtencion(atn.clave).then(
					function (data){
						// console.log(data);
						atn.datos = data.info;
						atn.tiposDocumento = data.tipos;
						atn.imagenes = data.imagenes;
						atn.cargando = false;
						atn.opacidad = {};
					},
					function (error){
						mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
						atn.cargando = false;
						atn.opacidad = {};
					}
				);

			}else{

				var data = JSON.parse( webStorage.local.get(atn.clave) ); 
				atn.datos = data.info;
				atn.tiposDocumento = data.tipos;
				atn.imagenes = data.imagenes;
			}

		}

		function cambio(){
			console.log('Cambio')
		}

		function destruccion(){
			var datos = {
				info : atn.datos,
				tipos : atn.tiposDocumento,
				imagenes : atn.imagenes
			}

			webStorage.local.set(atn.clave, JSON.stringify(datos) )

		}


		function subirDigitales(files,tipo,ev){


			operacion.subirImagenes(tipo,files,atn.clave).then(
				function (data){
					console.log(data);
					atn.imagenes.push(data);
					atn.porcentaje = '';
					atn.tipo = '';
				},	
				function (error){
					mensajes.alerta(error,'error','top right','error');
					atn.porcentaje = '';
				},
				function (porcentaje){
					// console.log(porcentaje);
					atn.porcentaje = porcentaje;
				}
			)

		}

		function solicitaAutorizacion(){

			var datos = {
				atencion:atn.clave,
				usuario:$rootScope.id
			}

			operacion.solicitaAutorizacion(datos).success(function (data){
				atn.datos.ATN_estatus = 1;
				mensajes.alerta(data.respuesta,'success','top right','done_all');
			}).error(function (error){
				mensajes.alerta('Ocurrio un error vuelve a intentarlo por favor','error','top right','error');
			})
		}

		function eliminarDigitales(file,index,ev,etapa,entrega){

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

						mensajes.alerta(resp.data.flash,'success','top right','done_all');
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