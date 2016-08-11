(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('detalleCtrl',detalleCtrl)
	

	detalleCtrl.$inject = ['$rootScope','datos','busqueda','mensajes', 'publicfiles'];
	

	function detalleCtrl($rootScope,datos,busqueda, mensajes, publicfiles){

		// console.log(datos);

		// se inciliza el objeto del controlador y la vista
		var dt = this;

		//variable de error
		var mensajeError = 'Ocurrio un error al guardar intentelo nuevamente';

		// titulo en variable global
		$rootScope.titulo = 'Detalle del Folio: ' + datos.data.Exp_folio;
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

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
				nombre:'Problemas de Expediente',
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
		dt.muestraSeccion = muestraSeccion;
		dt.cierraSeccion = cierraSeccion;
		dt.subirDigitalesEt1 = subirDigitalesEt1;
		dt.muestraPanel = muestraPanel;


		function inicio(){
			// inicializacion de variables
			dt.dato = datos.data;
			dt.codigo = publicfiles + 'codigos/' + dt.dato.Exp_folio + '.png';
			dt.isOpen = false;
			dt.seleccionado = true;
			dt.seccion = false;
			dt.detalle = true;
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

		function subirDigitalesEt1(files){

			for (var i = 0;  i < files.length; i++) {
				
				var file = files[i];

				if (!file.$error) {
					console.log(file);					
				}else{
					mensajes.alerta('Formato Invalido','','top right','error');
				}

			};
		}

		function cargaDatosFolio (folio) {
			busqueda.datos(folio).then(function (data){

				dt.tickets = data.tickets;
				console.log(data);
			});

		}


	};

})();