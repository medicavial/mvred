(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('notaMedicaCtrl',notaMedicaCtrl)
	

	notaMedicaCtrl.$inject = ['$rootScope','datos','busqueda','mensajes', 'publicfiles','operacion', '$mdDialog', '$mdBottomSheet'];

	function notaMedicaCtrl($rootScope,datos,busqueda, mensajes, publicfiles,operacion, $mdDialog, $mdBottomSheet){

		// console.log(datos);

		// se inciliza el objeto del controlador y la vista
		var nm = this;

		//variable de error
		var mensajeError = 'Ocurrio un error al guardar intentelo nuevamente';

		// titulo en variable global
		$rootScope.titulo = 'Detalle del Folio: ' + datos.data.Exp_folio;
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		nm.folio = datos.data.Exp_folio;
		nm.producto = datos.data.Pro_clave;

		nm.paso1 = 'views/notaMedica/notaMedicaPaso1.html';
		nm.paso2 = 'views/notaMedica/notaMedicaPaso2.html';
		nm.paso3 = 'views/notaMedica/notaMedicaPaso3.html';
		nm.paso4 = 'views/notaMedica/notaMedicaPaso4.html';

		nm.guardaHistoria 	   = guardaHistoria; // funcion para guardar en base de datos los datos del paciente

		// funciones del controlador
		nm.secciones = [
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

		nm.cierraSeccion = cierraSeccion;
		nm.inicio = inicio;
		nm.muestraPanel = muestraPanel;
		nm.muestraSeccion = muestraSeccion;
		nm.nuevaAtencion = nuevaAtencion;
		nm.nuevaEt1 = nuevaEt1;
		nm.nuevaEt2 = nuevaEt2;
		nm.nuevaEt3 = nuevaEt3;
		nm.solicitudAutorizacion = solicitudAutorizacion;


		function inicio(){
			// inicializacion de variables
			nm.step1block = false;
			nm.step2block = true;
			nm.step3block = true;
			nm.step4block = true;
			nm.step5block = true;
			nm.tabActual = 0;
			nm.dato = datos.data;
			console.log(nm.dato);
			nm.datos = [];			
			nm.datos.nombre = nm.dato.Exp_completo;
			nm.datos.fecha= new Date(nm.dato.Exp_fechaNac2);
			nm.datos.anios= nm.dato.Exp_edad;
			nm.datos.meses= nm.dato.Exp_meses;
			nm.datos.telefono = nm.dato.Exp_telefono;
			nm.datos.correo = nm.dato.Exp_mail;
			nm.imagenes = [];
			nm.subsecuencias = [];
			nm.rehabilitaciones = [];
			nm.codigo = publicfiles + 'codigos/' + nm.dato.Exp_folio + '.png';
			nm.isOpen = false;
			nm.primera = '';
			nm.seleccionado = true;
			nm.seccion = false;
			nm.detalle = true;
			nm.consultaDetalle = false;
			nm.tipo = '';
			nm.porcentaje = '';

			nm.atencionIcon = "add";
			nm.iconPanel = 'expand_less';

			cargaDatosFolio(nm.dato.Exp_folio);
		}

		function muestraSeccion (page,icon,color){
			nm.page = page;
			nm.icon = icon;
			nm.bg   = color;
			nm.seccion = true;
			muestraPanel();
		}

		function cierraSeccion (page,icon){
			nm.seccion = false;
			if (!nm.detalle) muestraPanel();
			
		}

		function muestraPanel (){
			nm.detalle = !nm.detalle;
			nm.detalle == true ? nm.iconPanel = 'expand_less' : nm.iconPanel = 'expand_more';
		}
		function alerta(){
			alert("entro a la funcion");
		}

		function guardaHistoria(){
			nm.guardando = true;
			nm.guardando = false;
			nm.tabActual = 1;
			nm.step2block = false;
		}
		

		function cargaDatosFolio (folio) {

			busqueda.datosExpediente(folio).then(function (data){

				console.log(data);
				//damos información de tickets
				nm.tickets = data.tickets;
				// se carga la linea del tiempo del folio
				nm.historial = data.historial;
				//autorizaciones medicas
				nm.autorizaciones = data.autorizaciones;
				nm.solicitudes = data.solicitudes;

				nm.primera = data.primera[0]; 

				nm.subsecuencias = data.subsecuencias;
				nm.rehabilitaciones = data.rehabilitaciones;

			},function (error){

				nm.consultaDetalle = false;
				muestraPanel();
				mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
			});

		}

		function nuevaAtencion(){
			$mdBottomSheet.show({
				templateUrl: 'views/opcionesGrid.html',
				controllerAs: 'opt',
				clickOutsideToClose:true,
				locals:{primera:nm.primera},
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

			operacion.creaAtencion({folio:nm.folio,tipoAtn:1,consecutivo:1}).success(function (data){
				nm.primera = data;
			}).error(function (error){
				mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
			});
		}

		function nuevaEt2 (){

			operacion.creaAtencion({folio:nm.folio,tipoAtn:2,consecutivo: nm.subsecuencias.length + 1 }).success(function (data){
				nm.subsecuencias.push(data);
			}).error(function (error){
				mensajes.alerta('Error de Conexión vuelve a intentar','error','top right','error');
			});

		}

		function nuevaEt3 (){

			operacion.creaAtencion({folio:nm.folio,tipoAtn:3,consecutivo:nm.rehabilitaciones.length + 1}).success(function (data){
				nm.rehabilitaciones.push(data);
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
				locals:{datos:nm.dato},
				fullscreen: true,
				controller: 'solicitudAutorizacionCtrl',
				controllerAs: 'sol'
		    })
		    .then(function(solicitud) {
		      nm.solicitudes.push(solicitud);
		    });

		}


	};


})();