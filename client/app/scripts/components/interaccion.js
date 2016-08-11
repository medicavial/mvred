(function(){

	'use strict';

	angular
	.module('app')
	.component('interaccion',{
		templateUrl:'views/interaccion.html',
		controller: InteraccionCtrl,
		controllerAs:'it'
	});

	InteraccionCtrl.$inject = ['$rootScope'];

	function InteraccionCtrl($rootScope){
		var it = this;

		it.nombre = $rootScope.nombre;
		it.ir = ir;

		function ir(ruta){

			if ($mdSidenav('left').isOpen()) {
				$mdSidenav('left').toggle();
			}

			$state.go(ruta);
		};
	}

})();