(function(){

	'use strict';

	angular.module('app', [
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
	
	.constant('api', 'http://172.17.10.52/mvred/server/public/api/')
	// .constant('api', 'http://api.medicavial.net/api/')

	.constant('publicfiles','http://172.17.10.52/mvred/server/public/');
	// .constant('publicfiles','http://api.medicavial.net/exports/');
	

})();





