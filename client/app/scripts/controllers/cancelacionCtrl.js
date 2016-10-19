(function(){

	'use strict';
	
	angular.module('app')
	.controller('cancelacionCtrl',cancelacionCtrl)

	cancelacionCtrl.$inject = ['busqueda', 'operacion', '$rootScope','$mdDialog', 'folio', 'mensajes'];

	function cancelacionCtrl(busqueda, operacion, $rootScope,$mdDialog, folio, mensajes){

		var can = this;
		can.titulo = 'Solicitud de cancelación para el folio: ' + folio;

		inicio();
		buscaMotivos()

		function buscaMotivos(){
			busqueda.tiposCancelacion().success(function (data){
				can.motivos = data;
			});
		}

		function cerrar(){
			$mdDialog.hide(false);
		}

		function enviaSolicitud(){
			if (can.datosForm.$valid) {
				can.guardando = true;

				operacion.solicitaCancelacion(can.datos).success(function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					can.guardando = false;
					$mdDialog.hide(data.estatus);
				}).error(function (data){
					mensajes.alerta('Ocurrio un error intentelo nuevamente','error','top right','error');
					can.guardando = false;
				});		
			};
		}

		function inicio(){
			can.guardando = false;
			can.datos = {
				usuario:$rootScope.id,
				folio:folio,
				motivoId:'',
				motivo:'',
				folioSus:'',
				observaciones:''
			}

		}

		can.buscaMotivos = buscaMotivos;
		can.cerrar = cerrar;
		can.enviaSolicitud = enviaSolicitud;
		can.inicio = inicio;



	}

})();