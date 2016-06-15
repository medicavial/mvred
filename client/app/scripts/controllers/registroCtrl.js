(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('registroCtrl',registroCtrl)

	registroCtrl.$inject = ['$rootScope','datos','busqueda'];

	function registroCtrl($rootScope,datos,busqueda){

		// se inciliza el objeto del controlador y la vista
		var vm = this;
		// titulo en variable global
		$rootScope.titulo = 'Registro de Paciente';

		// inicializacion de variables
		vm.clientes = datos.data;
		vm.step1block = false;
		vm.step2block = true;
		vm.step3block = true;
		vm.step4block = true;

		vm.consultando = false;
		vm.tabActual = 0;

		vm.paso1 = 'views/registroPaso1.html';
		vm.paso2 = 'views/registroPaso2.html';
		vm.paso3 = 'views/registroPaso3.html';
		vm.paso4 = 'views/registroPaso4.html';

		// se definen las funciones
		vm.verificaProducto = verificaProducto;

		// funciones del controlador
		function verificaProducto(cliente){

			console.log(cliente);
			vm.consultando = true;

			busqueda.productos().success(function(data){
				vm.productos = data;
				vm.tabActual = 1;
				vm.step2block = false;
				vm.consultando = false;

			});

		}

	};

})();