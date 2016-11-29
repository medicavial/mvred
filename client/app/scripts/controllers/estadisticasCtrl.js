(function(){

	'use strict';

	angular.module('app')
	.controller('estadisticasCtrl',estadisticasCtrl)
	.controller('estadisticaCtrl',estadisticaCtrl)

	estadisticasCtrl.$inject = ['$rootScope', '$mdDialog', 'datos'];
	estadisticaCtrl.$inject = ['$rootScope', 'datos','$stateParams'];


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


	function estadisticaCtrl($rootScope, datos,$stateParams){

		console.log(datos);

		var es = this;

		es.datos = datos.data;
		es.tipo = $stateParams.tipo;

		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';
		
		if (es.tipo == 'documentos') {
			$rootScope.titulo = 'Detalle de Atenciones Sin Documentos';
		}else if (es.tipo == 'autorizar') {
			$rootScope.titulo = 'Detalle de Atenciones Con Documentos Sin Autorizar';
		}else if (es.tipo == 'factura'){
			$rootScope.titulo = 'Detalle de Atenciones Autorizadas Sin Facturar';
		}else if (es.tipo == 'rechazo'){
			$rootScope.titulo = 'Detalle de Atenciones Rechazadas';
		}else if (es.tipo == 'sinAtn'){
			$rootScope.titulo = 'Detalle de Expedientes Sin Registrar Atención';
		}else if (es.tipo == 'revisionFac'){
			$rootScope.titulo = 'Detalle de Atenciones Con Factura en Revisión';
		}
	}







})();