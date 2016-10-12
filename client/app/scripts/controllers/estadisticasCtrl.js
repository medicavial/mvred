(function(){

	'use strict';

	angular.module('app')
	.controller('estadisticasCtrl',estadisticasCtrl)

	estadisticasCtrl.$inject = ['$rootScope', '$mdDialog', 'datos'];


	function estadisticasCtrl($rootScope, $mdDialog, datos){

		var et = this;

		$rootScope.titulo = 'Estadisticas';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';
 		
 		et.datos = datos[2].data;

		et.meses = {
	        data: datos[1].data,
	        type: "serial",
	        categoryField: "MES",
	        rotate: false,
	        legend: {
	            enabled: false
	        },
	        chartScrollbar: {
	            enabled: false,
	        },
	        graphs: [{
	            type: "column",
	            title: "Cantidad",
	            valueField: "Cantidad",
	            fillAlphas: 0.9,
	            balloonText: "[[category]]<br><b>Atenciones: [[value]]</b>",
	        }]
	    }

  		et.semanas = {
	        data: datos[0].data,
	        type: "serial",
	        categoryField: "Semana",
	        rotate: false,
	        legend: {
	            enabled: false
	        },
	        chartScrollbar: {
	            enabled: false,
	        },
	        graphs: [{
	            type: "column",
	            title: "Cantidad",
	            valueField: "Cantidad",
	            fillAlphas: 0.9,
	            balloonText: "[[category]]<br><b>Atenciones: [[value]]</b>",
	        }]
	    }

	};




})();