(function(){

	'use strict';

	angular.module('app')
	.controller('documentosCtrl',documentosCtrl)
	.controller('altaDocumentoCtrl',altaDocumentoCtrl)

	documentosCtrl.$inject = ['$rootScope', '$mdDialog', 'datos'];
	altaDocumentoCtrl.$inject = ['$mdDialog', 'datos','operacion','mensajes','busqueda','filtro'];


	function documentosCtrl($rootScope, $mdDialog, datos){

		var dc = this;

		// dc.documentos = datos[0].data;
		dc.tiposDocumento = datos[0].data;
		dc.tiposAtencion = datos[1].data;
		dc.productos = datos[2].data;

		$rootScope.titulo = 'Atenciones - Documentos';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';
 		

 		dc.nuevo = nuevo;

 		function nuevo(ev){

 			$mdDialog.show({
		      controller: 'altaDocumentoCtrl',
		      controllerAs:'ad',
		      templateUrl: 'altaDocumento.html',
		      locals: { datos: {tiposDocumento:dc.tiposDocumento,tiposAtencion:dc.tiposAtencion,productos:dc.productos} },
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: true
		    });
 		}


	};


	function altaDocumentoCtrl($mdDialog,datos,operacion,mensajes,busqueda,filtro){
		
		// console.log(datos);

		var ad = this;

		ad.productos = datos.productos;
		ad.tiposDocumento = datos.tiposDocumento;
		ad.tiposAtencion = datos.tiposAtencion;

		ad.cancel = cancel;
		ad.inicio = inicio;
		ad.guardar = guardar;
		ad.toggle = toggle;
		ad.exists = exists;
		ad.siguiente = siguiente;

		inicio();

		function toggle(item, list) {

			var idx = list.indexOf(item);
			if (idx > -1) {
		  		list.splice(idx, 1);
			}
			else {
		  		list.push(item);
			}

		};

		function exists(item, list) {
			return list.indexOf(item) > -1;
		};

		function inicio(){

			ad.index = 0;
			ad.guardado = false;
			ad.guardando = false;

			ad.datos = {
				producto:'',
				atencion:'',
				documentos:[]
			}
		}

		function cancel(){
			$mdDialog.hide();
		}

		function guardar(){

			// console.log(ad.datos);
			ad.guardando = true;

			operacion.guardaDocumento(ad.datos).success(function (data){
				ad.guardado = true;
				ad.guardando = false;
				mensajes.alerta(data.flash,'success','top right','done_all');
				inicio();
			}).error(function (error){
				ad.guardando = false;
				mensajes.alerta('Ocurrio un error intentalo nuevamente','error','top right','error');
			})
		}

		function siguiente(){
			if (ad.datos.producto && ad.index == 0) {
				ad.index ++;	
			}else if(ad.datos.atencion && ad.index == 1){
				verificaDocumentos();
			}
		}

		function verificaDocumentos(){

			busqueda.productoAtencionDocumentos(ad.datos).then(
				function (respuesta){

					var documentosSeleccionados = respuesta.data;
					agregarExistencias(documentosSeleccionados);
					ad.index ++;
				},
				function (error){
					mensajes.alerta('Ocurrio un error intentalo nuevamente','error','top right','error');
				}
			);
		}


		function agregarExistencias(datos){
				
				// console.log(ad.tiposDocumento);
			angular.forEach( datos , function(dato,clave){

				console.log(dato.TID_clave);
				var documento = filtro.consulta(ad.tiposDocumento,dato.TID_clave)
				// var index =  ad.tiposDocumento.indexOf(documento);
				ad.datos.documentos.push(documento);
				// console.log(documento);

			});
		}



	}






})();