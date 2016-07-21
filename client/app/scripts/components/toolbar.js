(function(){

	'use strict';

	angular
	.module('app')
	.component('toolbar',{
		templateUrl:'views/toolbar.html',
		controller: toolbarCtrl,
		controllerAs:'tb',
		bindings: {
		  titulo: '=',
		  menu: '='
		}
	});


	function toolbarCtrl($rootScope, auth, $mdSidenav, $mdMedia, $window){

		var tb = this;

		// funciones del controlador

		tb.menuSwitch = menuSwitch;
		tb.logout = logout;
		tb.verificaVista = verificaVista;

		function menuSwitch(menuId) {
			if ($rootScope.atras) {
				$window.history.back();
			}else{
				$mdSidenav(menuId).toggle();
			}
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