(function(){

	'use strict';
	
	angular
	.module('app')
	.directive('portada', ['$window', function($window) {
	    return {
	        restrict: 'A',
	        link: function (scope, elem) {
	            elem.bind('click', function () {
	                $window.history.back();
	            });
	        }
	    };
	}]);

})();