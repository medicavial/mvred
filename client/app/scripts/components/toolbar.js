(function(){

	'use strict';

	angular
	.module('app')
	.component('toolbar',{
		templateUrl:'toolbar.html',
		controller: toolbarCtrl,
		controllerAs:'tb',
		bindings: {
		  titulo: '=',
		  menu: '=',
		  url:  '='
		}
	});


	function toolbarCtrl($rootScope, auth, $mdSidenav, $mdMedia, $window){

		var tb = this;

		// console.log($rootScope.url);

		// funciones del controlador
		tb.configSwitch = configSwitch;
		tb.menuSwitch = menuSwitch;
		tb.logout = logout;
		tb.verificaVista = verificaVista;
		tb.nombre = $rootScope.nombre;
		tb.unidad = $rootScope.nombreUni;

		function menuSwitch(menuId) {
			if ($rootScope.atras) {
				$window.history.back();
			}else{
				$mdSidenav(menuId).toggle();
			}
		};

		function configSwitch(menuId) {
			$mdSidenav(menuId).toggle();

		};

		function logout(){
			auth.logout();
		};

		function verificaVista(){
			if (!$mdMedia('gt-md')) {
				return true;
			}else if($rootScope.atras){
				return true;
			}else{
				return false;
			}
		};


	}

})();