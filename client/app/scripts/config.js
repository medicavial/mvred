(function(){

	'use strict';

	angular
	.module('app')
	.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider','$mdThemingProvider','$httpProvider','$compileProvider', '$mdDateLocaleProvider', '$sceDelegateProvider'];

	function config($stateProvider, $urlRouterProvider, $locationProvider,$mdThemingProvider,$httpProvider,$compileProvider, $mdDateLocaleProvider, $sceDelegateProvider) {

		$compileProvider.debugInfoEnabled(true);

		$sceDelegateProvider.resourceUrlWhitelist([
	        'self',
	        'http://medicavial.net/**',
	        'http://localhost/**'
	    ]);

		$mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
		$mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul', 'Ago','Sep','Oct','Nov','Dic'];
		$mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes','Sabado'];
		$mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi' ,'Sa'];
		moment.locale('es');

	  	$mdDateLocaleProvider.formatDate = function(date) {
		    return date ? moment(date).format('DD/MM/YYYY') : '';
		};
		  
		$mdDateLocaleProvider.parseDate = function(dateString) {
		    var m = moment(dateString, 'DD/MM/YYYY', true);
		    return m.isValid() ? m.toDate() : new Date(NaN);
		};      

		$urlRouterProvider.otherwise('/home');

		$stateProvider

		.state('login', {
			url: '/login',
			templateUrl: 'views/login.html',
			controller: 'loginCtrl',
			controllerAs: 'sesion'
		})

		.state('index', {
			url: '/',
			abstract:true,
			templateUrl: 'views/base.html'
		})


		.state('index.ayuda',{
			url:'ayuda',
			templateUrl :'views/ayuda.html',
			controller:'ayudaCtrl',
			controllerAs:'au'
		})

		.state('index.busqueda',{
			url:'busqueda',
			templateUrl :'views/busqueda.html',
			controller:'busquedaCtrl',
			controllerAs:'bs'
		})

		.state('index.busquedaGeneral',{
			url:'busquedaGeneral',
			templateUrl :'views/busqueda.html',
			controller:'busquedaGeneralCtrl',
			controllerAs:'bs'
		})

		.state('index.documentos',{
			url:'documentos',
			templateUrl :'views/documentos.html',
			controller:'documentosCtrl',
			controllerAs:'dc',
			resolve : {
				datos : function(busqueda,$q){
					var promesa 		= $q.defer(),
						productos 		= busqueda.productos(),
						tiposAtencion   = busqueda.tiposAtencion(),
						tiposDocumento 	= busqueda.tiposDocumento();

					$q.all([tiposDocumento,tiposAtencion,productos]).then(function (data){
						promesa.resolve(data);
					},function (error){
						promesa.reject('Error');
					});

					return promesa.promise;
				}
			}
		})

		.state('index.estadisticas',{
			url:'estadisticas',
			templateUrl :'views/estadisticas.html',
			controller:'estadisticasCtrl',
			controllerAs:'et',
			resolve : {
				datos : function(reportes,$q){
					var promesa 		= $q.defer(),
						atencionesMes 	= reportes.atencionesMes(),
						atencionesAnio 	= reportes.atencionesAnio();

					$q.all([atencionesMes,atencionesAnio]).then(function (data){
						promesa.resolve(data);
					},function (error){
						promesa.reject('Error');
					});

					return promesa.promise;
				}
			}
		})

		.state('index.formatos',{
			url:'formatos',
			templateUrl :'views/formatos.html',
			controller:'formatosCtrl',
			controllerAs:'fr'
		})

		.state('index.home',{
			url:'home',
			templateUrl :'views/home.html',
			controller:'homeCtrl',
			controllerAs:'hm'
		})

		.state('index.registro',{
			url:'registro',
			templateUrl :'views/registro.html',
			controller:'registroCtrl',
			controllerAs:'rg',
			resolve: {
				datos : function(busqueda,$q){

					var promesa  	= $q.defer(),
						clientes 	= busqueda.clientes();
					
					$q.all([clientes]).then(function (data){
						
						var datos = {
							clientes:data[0].data
						}
						promesa.resolve(datos);
						
					},function(error){
						promesa.reject('error en consulta');
					});

					return promesa.promise;
				}
			}
		})

		.state('index.detalle',{			
			url:'detalle?folio',
			templateUrl :'views/detalle.html',
			controller:'detalleCtrl',
			controllerAs:'dt',
			resolve: {
				datos : function(busqueda,$stateParams){
					return busqueda.detalleFolio($stateParams.folio);
				}
			},
			reload:true
		});

		// .state('detalle', {
		// 	url: '/detalle?folio',
		// 	templateUrl :'views/detalle.html',
		// 	controller:'detalleCtrl',
		// 	controllerAs:'dt',
		// 	resolve: {
		// 		datos : function(busqueda,$stateParams){
		// 			return busqueda.detalleFolio($stateParams.folio);
		// 		}
		// 	}
		// })


		$locationProvider.html5Mode(true);

	    $mdThemingProvider.theme('theme1')
		.primaryPalette('indigo')
	    .accentPalette('red');

	    $mdThemingProvider.theme('theme2')
		.primaryPalette('deep-orange')
		.warnPalette('indigo')
	    .accentPalette('red');

	    $mdThemingProvider.theme('theme3')
		.primaryPalette('neonBlue')
	    .accentPalette('red');

	    $mdThemingProvider.theme('theme4')
		.primaryPalette('blue-grey')
	    .accentPalette('red');

	    $mdThemingProvider.theme('theme5')
		.primaryPalette('neonGreen')
	    .accentPalette('red');

	    $mdThemingProvider.theme('theme6')
		.primaryPalette('deep-purple')
	    .accentPalette('red');

	    $mdThemingProvider.theme('docs-dark')
		.primaryPalette('red')
		.dark();

		var neonBlueMap = $mdThemingProvider.extendPalette('blue', {
			'500': '#3175E7',
			'contrastDefaultColor': 'light'
		});

		var neonGreenMap = $mdThemingProvider.extendPalette('green', {
			'500': '#259B24',
			'contrastDefaultColor': 'light'
		});

		
		// Register the new color palette map with the name <code>neonRed</code>
		$mdThemingProvider.definePalette('neonBlue', neonBlueMap);
		$mdThemingProvider.definePalette('neonGreen', neonGreenMap);
		
	    $mdThemingProvider.setDefaultTheme('theme1');
	    $mdThemingProvider.alwaysWatchTheme(true);

	    $httpProvider.defaults.timeout = 1000;
	  	
	}

})();
