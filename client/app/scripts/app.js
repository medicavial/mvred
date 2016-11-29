(function(){

	'use strict';

	angular.module('app', [
		'app.templates',
		'ui.router',
		'ngMaterial',
		'ngMdIcons',
		'webStorageModule',
		'ngMessages',
		'ngResource',
		'ngAnimate',
		'md.data.table',
		'ngFileUpload',
		'angular.filter',
		'mdPickers',
		'material.components.expansionPanels',
		'vjs.video',
		'amChartsDirective'
	])
	
	//ip produccion
	
	.constant('api', 'http://api.medicavial.net/api/')
	.constant('registro', 'http://medicavial.net/registro/')
	.constant('publicfiles','http://api.medicavial.net/');

	// .constant('api', 'http://localhost/mvred/server/public/api/')
	// .constant('registro', 'http://localhost/registro/')
	// .constant('publicfiles','http://localhost/mvred/server/public/');
	

})();





