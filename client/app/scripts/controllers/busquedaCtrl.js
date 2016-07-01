(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('busquedaCtrl',busquedaCtrl)
	

	busquedaCtrl.$inject = ['$rootScope','datos','busqueda','mensajes', 'publicfiles'];
	

	function busquedaCtrl($rootScope,datos,busqueda, mensajes, publicfiles){

		// se inciliza el objeto del controlador y la vista
		var bs = this;

		//variable de error
		var mensajeError = 'Ocurrio un error al guardar intentelo nuevamente';

		// titulo en variable global
		$rootScope.titulo = 'Consulta de registros';

		// inicializacion de variables
		bs.registros = datos;

		// se definen las funciones
		bs.inicio = inicio; //funcion para limpiar todos los campos

		bs.buscar = buscar; //funcion para buscar el registro especificado

		

		function buscar(){

			bs.consultando = true;

			busqueda.registros(bs.datos).then(
				function (data){
					bs.registros = data;
					bs.consultando = false;
					bs.datos.folio = '';
				},function (error){
					mensajes.alerta(error,'error','top right','done_all');
					bs.consultando = false;
				}
			)
		}

		function inicio(){

			bs.datos = {
				lesionado:'',
				folio:''
			}

			bs.consultando = false;
		}

	};

})();