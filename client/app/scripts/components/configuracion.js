(function(){

	'use strict';

	angular
	.module('app')
	.component('configuracion',{
		templateUrl:'configuracion.html',
		controller: configuracionCtrl,
		controllerAs:'conf'
	});

	configuracionCtrl.$inject = ['$rootScope','$state','$mdSidenav','busqueda', 'filtro', 'webStorage'];

	function configuracionCtrl($rootScope,$state,$mdSidenav, busqueda, filtro, webStorage){

		var conf = this;
		
		//al cargar el el componente se ejecuta la funcion inicio
		conf.$onInit = inicio;

		conf.cerrar = cerrar;
		conf.cambiaModo = cambiaModo;
		conf.seleccionaUnidad = seleccionaUnidad;

		function inicio(){

			conf.modoGuiado = $rootScope.modoGuiado;
			conf.permisos = $rootScope.permisos;
			conf.unidad = $rootScope.unidad;

			busqueda.unidades().then(function (res){
				conf.unidades = res.data;
			});
		}

		function cerrar(){
			$mdSidenav('right').toggle();
		};

		function cambiaModo(){
			conf.modoGuiado = !conf.modoGuiado;
			$rootScope.modoGuiado = !$rootScope.modoGuiado;
		}

		function seleccionaUnidad(){

			filtro.buscaUnidad(conf.unidades,conf.unidad).then(function (res){

				// console.log(res);
				webStorage.session.add('unidad',res.Uni_clave);
	            webStorage.session.add('nombreUni',res.Uni_nombrecorto);

				$rootScope.unidad = res.Uni_clave;
				$rootScope.nombreUni = res.Uni_nombrecorto;

				$state.go('index.home');
				
			});


		}
	}

})();