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
		  url:  '=',
		  unidad: '='
		}
	})
	.controller('notificacionCtrl', notificacionCtrl);

	notificacionCtrl.$inject = ['$mdDialog','datos'];
	toolbarCtrl.$inject = ['$rootScope', 'auth', '$mdSidenav', '$mdMedia', '$window', '$state', '$mdDialog','reportes'];


	function toolbarCtrl($rootScope, auth, $mdSidenav, $mdMedia, $window, $state, $mdDialog,reportes){

		var tb = this;

		tb.info = [];

		// console.log($rootScope.url);

		// funciones del controlador
		tb.configSwitch = configSwitch;
		tb.menuSwitch = menuSwitch;
		tb.notificaciones = notificaciones;
		tb.logout = logout;
		tb.verificaVista = verificaVista;
		tb.nombre = $rootScope.nombre;

		consultaNotificaciones();

		function menuSwitch(menuId) {
			if ($rootScope.atras) {
				$window.history.back();
			}else{
				$mdSidenav(menuId).toggle();
			}
		};

		function configSwitch(menuId) {

			console.log(menuId);
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

		function notificaciones(ev){

			$mdDialog.show({
				controller: notificacionCtrl,
				controllerAs:'not',
				templateUrl: 'notificacion.html',
				parent: angular.element(document.body),
				locals:{datos:tb.info},
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: true 
		    });
		    
		}

		function consultaNotificaciones(){

			reportes.notificacionUnidad(tb.unidad).then(function (resp){
				tb.info = resp.data;
			});
		}

	}

	function notificacionCtrl($mdDialog,datos){
		

		console.log(datos);
		
		var not = this;
		not.datos = datos;

		not.cerrar = cerrar;

		function cerrar(){

			$mdDialog.hide();
		}

	}

})();