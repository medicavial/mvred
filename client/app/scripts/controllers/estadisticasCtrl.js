(function(){

	'use strict';

	angular.module('app')
	.controller('estadisticasCtrl',estadisticasCtrl)
	.controller('estadisticaCtrl',estadisticaCtrl)

	estadisticasCtrl.$inject = ['$rootScope', '$mdDialog', 'datos', 'reportes','fechas'];
	estadisticaCtrl.$inject = ['$rootScope', 'datos','$stateParams'];

	function estadisticasCtrl($rootScope, $mdDialog, datos, reportes,fechas){

		var et = this;

		// console.log(fechas);

		et.info = datos;
		et.inicio = inicio;
		et.cargaInfo = cargaInfo;

		inicio();

		$rootScope.titulo = 'Estadisticas';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		function cargaInfo(){

			et.cargandoInfo = true;

			fechas.fechaIni = et.fechaIni;
			fechas.fechaFin = et.fechaFin;

			reportes.estadisticasXfecha(et.fechaIni,et.fechaFin).then(function (res){
				et.cargandoInfo = false;
				et.datos = res.data;
			},function (err){

			});
		}

	    function inicio(){

	    	et.cargandoInfo = false;

			et.fechaIni = new Date(moment(fechas.fechaIni).format());
            et.fechaFin = new Date(moment(fechas.fechaFin).format());

	    	et.datos = et.info[2].data;

			et.meses = {
		        data: et.info[1].data,
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
		        data: et.info[0].data,
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
	    }
	    
	};


	function estadisticaCtrl($rootScope, datos,$stateParams){

		// console.log(datos);

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
		}else if (es.tipo == 'facturaAut'){
			$rootScope.titulo = 'Detalle de Atenciones Con Factura Autorizada';
		}else if (es.tipo == 'facturaRec'){
			$rootScope.titulo = 'Detalle de Atenciones Con Factura Rechazada';
		}else if (es.tipo == 'pagados'){
			$rootScope.titulo = 'Detalle de Atenciones Pagadas';
		}
	
	}


})();