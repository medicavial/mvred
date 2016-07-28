(function(){

	'use strict';

	angular
	.module('app')
	.component('menu',{
		templateUrl:'views/menu.html',
		controller: MenuCtrl,
		controllerAs:'mn'
	});

	MenuCtrl.$inject = ['$rootScope','$state','$mdSidenav'];

	function MenuCtrl($rootScope,$state,$mdSidenav){
		var mn = this;

		mn.nombre = $rootScope.nombre;
		mn.ir = ir;

		function ir(ruta){

			if ($mdSidenav('left').isOpen()) {
				$mdSidenav('left').toggle();
			}

			$state.go(ruta);
		};
	}

})();