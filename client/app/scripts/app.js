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
		'material.components.expansionPanels'
	])
	
	.constant('api', 'http://localhost/mvred/server/public/api/')
	// .constant('api', 'http://api.medicavial.mx/api/')

	.constant('publicfiles','http://localhost/mvred/server/public/');
	// .constant('publicfiles','http://api.medicavial.mx/exports/')
	

})();





