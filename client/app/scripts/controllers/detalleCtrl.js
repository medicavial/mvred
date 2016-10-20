(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('detalleCtrl',detalleCtrl)
	.controller('visorCtrl',visorCtrl)
	

	detalleCtrl.$inject = ['$rootScope','datos','busqueda','mensajes', 'publicfiles','operacion', '$mdDialog', '$mdBottomSheet'];
	visorCtrl.$inject = ['$scope','$mdDialog','imagen'];

	function detalleCtrl($rootScope,datos,busqueda, mensajes, publicfiles,operacion, $mdDialog, $mdBottomSheet){

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
		dt.producto = datos.data.Pro_clave;

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

		dt.cierraSeccion = cierraSeccion;
		dt.inicio = inicio;
		dt.muestraPanel = muestraPanel;
		dt.muestraSeccion = muestraSeccion;
		dt.nuevaAtencion = nuevaAtencion;
		dt.nuevaEt1 = nuevaEt1;
		dt.nuevaEt2 = nuevaEt2;
		dt.nuevaEt3 = nuevaEt3;
		dt.solicitudAutorizacion = solicitudAutorizacion;


		function inicio(){
			// inicializacion de variables
			dt.dato = datos.data;
			dt.imagenes = [];
			dt.subsecuencias = [];
			dt.rehabilitaciones = [];
			dt.codigo = publicfiles + 'codigos/' + dt.dato.Exp_folio + '.png';
			dt.isOpen = false;
			dt.primera = '';
			dt.seleccionado = true;
			dt.seccion = false;
			dt.detalle = true;
			dt.consultaDetalle = false;
			dt.tipo = '';
			dt.porcentaje = '';

			dt.atencionIcon = "add";
			dt.iconPanel = 'expand_less';

			cargaDatosFolio(dt.dato.Exp_folio);
		}

		function muestraSeccion (page,icon,color){

			if (dt.dato.Exp_cancelado == 1 || dt.dato.Exp_solCancela == 1) {
				mensajes.alerta('El folio esta inactivo','error','top right','error');
			}else{
				dt.page = page;
				dt.icon = icon;
				dt.bg   = color;
				dt.seccion = true;
				muestraPanel();
			}
		}

		function cierraSeccion (page,icon){
			dt.seccion = false;
			if (!dt.detalle) muestraPanel();
			
		}

		function muestraPanel (){
			dt.detalle = !dt.detalle;
			dt.detalle == true ? dt.iconPanel = 'expand_less' : dt.iconPanel = 'expand_more';
		}

		

		function cargaDatosFolio (folio) {

			busqueda.datosExpediente(folio).then(function (data){

				console.log(data);
				//damos información de tickets
				dt.tickets = data.tickets;
				// se carga la linea del tiempo del folio
				dt.historial = data.historial;
				//autorizaciones medicas
				dt.autorizaciones = data.autorizaciones;
				dt.solicitudes = data.solicitudes;

				dt.primera = data.primera[0]; 

				dt.subsecuencias = data.subsecuencias;
				dt.rehabilitaciones = data.rehabilitaciones;

			},function (error){

				dt.consultaDetalle = false;
				muestraPanel();
				mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
			});

		}

		function nuevaAtencion(){
			$mdBottomSheet.show({
				templateUrl: 'views/opcionesGrid.html',
				controllerAs: 'opt',
				clickOutsideToClose:true,
				locals:{primera:dt.primera},
				controller: function(primera,$mdBottomSheet){
					var opt = this;
					console.log(primera)
					opt.items = [
						{icon:'filter_1',name:'Primera Atención',disabled:primera == undefined ? false:true},
						{icon:'add_to_queue',name:'Subsecuencia',disabled:primera == undefined ? true:false},
						{icon:'directions_walk',name:'Rehabiliticación',disabled:primera == undefined ? true:false}
					];

					opt.opcion = function(index){
						$mdBottomSheet.hide(index);
					}
				}
		    }).then(function(opcion) {

		    	if (opcion == 0) nuevaEt1();
		    	if (opcion == 1) nuevaEt2();
		    	if (opcion == 2) nuevaEt3();
		    });
		}

		
		function nuevaEt1 (){

			operacion.creaAtencion({folio:dt.folio,tipoAtn:1,consecutivo:1}).success(function (data){
				dt.primera = data;
			}).error(function (error){
				mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
			});
		}

		function nuevaEt2 (){

			operacion.creaAtencion({folio:dt.folio,tipoAtn:2,consecutivo: dt.subsecuencias.length + 1 }).success(function (data){
				dt.subsecuencias.push(data);
			}).error(function (error){
				mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
			});

		}

		function nuevaEt3 (){

			operacion.creaAtencion({folio:dt.folio,tipoAtn:3,consecutivo:dt.rehabilitaciones.length + 1}).success(function (data){
				dt.rehabilitaciones.push(data);
			}).error(function (error){
				mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
			});

		}

		function solicitudAutorizacion(imagen,ev){

			$mdDialog.show({
				templateUrl: 'views/solicitudAutorizacion.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false,
				locals:{datos:dt.dato},
				fullscreen: true,
				controller: 'solicitudAutorizacionCtrl',
				controllerAs: 'sol'
		    })
		    .then(function(solicitud) {
		      dt.solicitudes.push(solicitud);
		    });

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
	        return 'http://medicavial.net/registro/' + $scope.archivo + '/' + $scope.imagen;
	        // return 'http://localhost/registro/' + $scope.archivo + '/' + $scope.imagen;
	    };
	}

})();