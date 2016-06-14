(function(){

	'use strict';

	angular
	.module('app')
	.run(run);

	run.$inject = ['$rootScope', '$state', '$mdSidenav','$mdBottomSheet','auth','webStorage','$window', 'api','$mdMedia', 'mensajes'];

	function run($rootScope, $state,$mdSidenav,$mdBottomSheet,auth,webStorage,$window, api,$mdMedia, mensajes) {

		//seteo inicial de la app
		var url = '';
		$rootScope.atras = false;

		//parametros globales tomados del localStorage
		$rootScope.username = webStorage.session.get('username');
		$rootScope.nombre = webStorage.session.get('nombre');
		$rootScope.id = webStorage.session.get('id');


		$rootScope.toggleSidenav = function(menuId) {
			if ($rootScope.atras) {
				$window.history.back();
			}else{
				$mdSidenav(menuId).toggle();
			}
		};

		$rootScope.muestra = function(ruta) {
		    $state.go(ruta);
		};


		$rootScope.logout = function(){
			$mdBottomSheet.hide();
			auth.logout();
		};

		$rootScope.ir = function(ruta){

			if ($mdSidenav('left').isOpen()) {
				$mdSidenav('left').toggle();
			}

			$state.go(ruta);
		};


		$rootScope.$on('$stateChangeStart',	function(event, toState, toParams, fromState, fromParams){ 
	        
	        $rootScope.atras = false;

	        url = toState.name;
		    if(url !== 'login' && webStorage.session.get('username') === null)
	        {   
	        	event.preventDefault();
	            $state.go('login');
	        }
	        //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
	        if(url === 'login' && webStorage.session.get('username') !== null)
	        {
	        	event.preventDefault();
	            $state.go('index.home');
	        }

	        $rootScope.cargando = true;
		});

	    $rootScope.$on('$stateChangeSuccess',	function(event, toState, toParams, fromState, fromParams){ 
	        $rootScope.cargando = false;
	        $rootScope.menu = 'menu';
		});

		$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
			$rootScope.cargando = false;
			mensajes.alerta('Problemas de conexión intentalo nuevamente por favor','error','top right','error');
			event.preventDefault();
            $state.go('index.home');
		});

		$rootScope.verificaVista = function(){
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