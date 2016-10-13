(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('busquedaCtrl',busquedaCtrl)
	.controller('busquedaGeneralCtrl',busquedaGeneralCtrl)
	

	busquedaCtrl.$inject = ['$rootScope','registros','mensajes', 'publicfiles'];
	busquedaGeneralCtrl.$inject = ['$rootScope','registrosGlobales','mensajes', 'publicfiles'];
	

	function busquedaCtrl($rootScope,registros, mensajes, publicfiles){

		// se inciliza el objeto del controlador y la vista
		var bs = this;

		//variable de error
		var mensajeError = 'Ocurrio un error de conexión intentelo nuevamente';

		// titulo en variable global
		$rootScope.titulo = 'Consulta de registros';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		// inicializacion de variables

		// se definen las funciones
		bs.inicio = inicio; //funcion para limpiar todos los campos
		bs.buscar = buscar; //funcion para buscar el registro especificado
		bs.ordenar = ordenar; // funcion para ordenar y buscar en query

		bs.detalle = [];
		bs.selected = [];

		bs.muestraDetalle = function(folio){
			// bs.detalle = [];
		   	console.log(folio);
		}


		function buscar(){
			bs.consultando = true;
			if (bs.datos.folio != '') {
				bs.busqueda = 'Folio MV: ' + bs.datos.folio;
			};

			if (bs.datos.folioInt != '') {
				bs.busqueda = 'Folio Interno: ' + bs.datos.folioInt;
			};

			if (bs.datos.lesionado != '') {
				bs.busqueda = 'Lesionado: ' + bs.datos.lesionado;
			};
			bs.consulta = registros.get(bs.datos,muestraDatos,error).$promise;
		}

		function error(data){
			bs.consultando = false;
			mensajes.alerta(mensajeError,'error','top right','error');
		}


		function inicio(){
			bs.datos = {
				unidad:$rootScope.unidad,
				page:1,
				folio:'',
				folioInt:'',
				lesionado:'',
				limit:10,
				order:'-Exp_fecreg'
			};

			bs.paginacion = [10,20,30,40,50];
			bs.busqueda = 'Ultimos registros';
			bs.lesionado = '';
			bs.folio = '';
			bs.consultando = false;
			bs.pageSelect = true;

			buscar();
		}

		function muestraDatos(response){
			bs.registros = response.data;
			bs.limite = response.per_page;
			bs.pagina = response.current_page;
			bs.total = response.total;
			bs.consultando = false;
		}

		function ordenar(order) {

		    console.log('Scope Order: ' + bs.order);
		    console.log('Order: ' + order);

	  	};

	};

	function busquedaGeneralCtrl($rootScope,registrosGlobales, mensajes, publicfiles){

		// se inciliza el objeto del controlador y la vista
		var bs = this;

		//variable de error
		var mensajeError = 'Ocurrio un error de conexión intentelo nuevamente';

		// titulo en variable global
		$rootScope.titulo = 'Consulta de registros';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		// inicializacion de variables

		// se definen las funciones
		bs.inicio = inicio; //funcion para limpiar todos los campos
		bs.buscar = buscar; //funcion para buscar el registro especificado
		bs.ordenar = ordenar; // funcion para ordenar y buscar en query

		bs.detalle = [];

		bs.muestraDetalle = function(index,folio){
			// bs.detalle = [];
		   	bs.detalle[index] = !bs.detalle[index];
		   	bs.dato = folio;
		}


		function buscar(){
			bs.consultando = true;

			if (bs.datos.folio != '') {
				bs.busqueda = 'Folio MV: ' + bs.datos.folio;
			};

			if (bs.datos.folioInt != '') {
				bs.busqueda = 'Folio Interno: ' + bs.datos.folioInt;
			};

			if (bs.datos.lesionado != '') {
				bs.busqueda = 'Lesionado: ' + bs.datos.lesionado;
			};

			bs.consulta = registrosGlobales.get(bs.datos,muestraDatos,error).$promise;
		}

		

		function inicio(){
			bs.datos = {
				unidad:$rootScope.unidad,
				page:1,
				folio:'',
				lesionado:'',
				limit:10,
				order:'-Exp_fecreg'
			};

			bs.paginacion = [10,20,30,40,50];
			bs.lesionado = '';
			bs.folio = '';
			bs.consultando = false;
			bs.pageSelect = true;
		}

		function muestraDatos(response){
			bs.registros = response.data;
			bs.limite = response.per_page;
			bs.pagina = response.current_page;
			bs.total = response.total;
			bs.consultando = false;
		}


		function error(data){
			bs.consultando = false;
			mensajes.alerta(mensajeError,'error','top right','error');
		}

		function ordenar(order) {

		    console.log('Scope Order: ' + bs.order);
		    console.log('Order: ' + order);

	  	};

	};

})();