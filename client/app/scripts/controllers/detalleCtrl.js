(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('detalleCtrl',detalleCtrl)
	.controller('visorCtrl',visorCtrl)
	

	detalleCtrl.$inject = ['$rootScope','datos','busqueda','mensajes', 'publicfiles','operacion', '$mdDialog'];
	visorCtrl.$inject = ['$scope','$mdDialog','imagen'];

	function detalleCtrl($rootScope,datos,busqueda, mensajes, publicfiles,operacion, $mdDialog){

		// console.log(datos);

		// se inciliza el objeto del controlador y la vista
		var dt = this;

		//variable de error
		var mensajeError = 'Ocurrio un error al guardar intentelo nuevamente';

		// titulo en variable global
		$rootScope.titulo = 'Detalle del Folio: ' + datos.data.Exp_folio;
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		dt.folio = datos.data.Exp_folio;
		// funciones del controlador

		dt.secciones = [
			{
				nombre:'Atenciones',
				background:'blueGray400',
				icon:'folder_shared',
				col:'1',
				row:'1',
				size:'84',
				page:'views/atenciones.html'
			},
			{
				nombre:'Autorizaciones',
				background:'teal',
				icon:'beenhere',
				col:'1',
				row:'1',
				size:'84',
				page:'views/autorizaciones.html'
			},
			{
				nombre:'Problemas',
				background:'red400',
				icon:'warning',
				col:'1',
				row:'1',
				size:'84',
				page:'views/tickets.html'
			},
			{
				nombre:'Pagos',
				background:'green600',
				icon:'credit_card',
				col:'1',
				row:'1',
				size:'84',
				page:'views/pagosExpediente.html'
			},
			{
				nombre:'Linea de Tiempo',
				background:'purple400',
				icon:'toc',
				col:'1',
				row:'1',
				size:'84',
				page:'views/timeline.html'
			},
			{
				nombre:'Interaccion',
				background:'indigo400',
				icon:'chat',
				col:'1',
				row:'1',
				size:'84',
				page:'views/comunicacion.html'
			}
		];

		dt.inicio = inicio;
		dt.muestraArchivo = muestraArchivo;
		dt.cierraSeccion = cierraSeccion;
		dt.subirDigitalesEt1 = subirDigitalesEt1;
		dt.eliminarDigitalesEt1 = eliminarDigitalesEt1;
		dt.muestraPanel = muestraPanel;
		dt.muestraSeccion = muestraSeccion;


		function inicio(){
			// inicializacion de variables
			dt.dato = datos.data;
			dt.imagenes = [];
			dt.codigo = publicfiles + 'codigos/' + dt.dato.Exp_folio + '.png';
			dt.isOpen = false;
			dt.seleccionado = true;
			dt.seccion = false;
			dt.detalle = true;
			dt.consultaDetalle = false;
			dt.tipo = '';
			dt.estatusEt1 = '';
			dt.porcentaje = '';

			dt.atencionIcon = "add";
			dt.iconPanel = 'expand_less';

			cargaDatosFolio(dt.dato.Exp_folio);
		}

		function muestraSeccion (page,icon,color){
			dt.page = page;
			dt.icon = icon;
			dt.bg   = color;
			dt.seccion = true;
			muestraPanel();
		}

		function cierraSeccion (page,icon){
			dt.seccion = false;
			if (!dt.detalle) muestraPanel();
			
		}

		function muestraPanel (){
			dt.detalle = !dt.detalle;
			dt.detalle == true ? dt.iconPanel = 'expand_less' : dt.iconPanel = 'expand_more';
		}

		function subirDigitalesEt1(files,tipo){

			operacion.subirImagenes(dt.folio,tipo,files,1,1).then(
				function (data){
					console.log(data);
					dt.imagenes.push(data);
					dt.porcentaje = '';
				},	
				function (error){
					mensajes.alerta(error,'error','top right','error');
					dt.porcentaje = '';
				},
				function (porcentaje){
					// console.log(porcentaje);
					dt.porcentaje = porcentaje;
				}
			)
			
		}

		function eliminarDigitalesEt1(file,index,ev){

			var confirm = $mdDialog.confirm()
				.title('Deseas eliminar este archivo?')
				.textContent('')
				.ariaLabel('¿Deseas eliminar imagen?')
				.targetEvent(ev)
				.ok('SI')
				.cancel('NO');
		    $mdDialog.show(confirm).then(function() {
		      
				operacion.eliminaImagen(file).then(
					function (resp){

						mensajes.alerta(resp.data.flash,'success','top right','done_all');
						dt.imagenes.splice(index, 1);
					},	
					function (error){
						mensajes.alerta(error,'error','top right','error');
					}
				)

		    });

			
		}

		function cargaDatosFolio (folio) {
			dt.consultaDetalle = true;
			busqueda.datosExpediente(folio).then(function (data){

				console.log(data);

				//imagenes del folio
				dt.imagenes = data.imagenes;

				//damos información de tickets
				dt.tickets = data.tickets;

				// se carga la linea del tiempo del folio
				dt.historial = data.historial;

				//se cargan tipos de documento
				dt.tiposDocumento = data.tiposDocumento;

				//autorizaciones medicas
				dt.autorizaciones = data.autorizaciones;

				// console.log(data);
				dt.consultaDetalle = false;

			},function (error){

				dt.consultaDetalle = false;
				muestraPanel();
				mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
			});

		}

		function muestraArchivo(imagen,ev){

			$mdDialog.show({
				templateUrl: 'views/visor.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals:{imagen:imagen},
				fullscreen: true,
				controller: visorCtrl
		    });

		}

		function verificaImagenes (imagenes){



		}


	};


	function visorCtrl($scope,$mdDialog,imagen){

		$scope.archivo = imagen.archivo;
		$scope.imagen = imagen.clave;

		$scope.cerrar = function(){
			$mdDialog.cancel();
		}

		$scope.picture = function(){
	        //se obtiene la extension del archivo
	        var extn = $scope.imagen.split(".").pop();

	        if (extn == 'jpg' || extn == 'jpeg' || extn == 'png' || extn == 'PNG' ) {
	            return true;
	        }else{
	            return false;
	        }
	    }

	    $scope.file = function(){
	        //se obtiene la extension del archivo
	        var extn = $scope.imagen.split(".").pop();
	        if (extn == 'pdf' || extn == 'PDF') {
	            return true;
	        }else{
	            return false;
	        }
	    }

		$scope.obtenerFrame = function(src) {
	        // return 'http://medicavial.net/registro/' + $scope.archivo + '/' + $scope.imagen;
	        return 'http://localhost/registro/' + $scope.archivo + '/' + $scope.imagen;
	    };
	}

})();