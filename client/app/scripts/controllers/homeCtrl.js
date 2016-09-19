(function(){

	'use strict';

	angular.module('app')
	.controller('homeCtrl',homeCtrl);

	homeCtrl.$inject = ['$rootScope'];

	function homeCtrl($rootScope){

		var hm = this;

		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Bienvenido';

		hm.secciones = [
			{
				nombre:'Registro',
				background:'blueG',
				icon:'assignment',
				col:'2',
				row:'1',
				size:'104',
				permiso:true,
				url:'index.registro'
			},
			{
				nombre:'Formatos',
				background:'greenG',
				icon:'insert_drive_file',
				col:'2',
				row:'1',
				size:'84',
				permiso:true,
				url:'index.formatos'
			},
			{
				nombre:'Ayuda',
				background:'orangeG',
				icon:'help',
				col:'2',
				row:'1',
				size:'84',
				permiso:true,
				url:'index.ayuda'
			},
			{
				nombre:'Expediente',
				background:'redG',
				icon:'search',
				col:'2',
				row:'1',
				size:'84',
				permiso:true,
				url:'index.busqueda'
			},
			{
				nombre:'Conciliación',
				background:'grayG',
				icon:'attach_money',
				col:'1',
				row:'1',
				size:'84',
				permiso:true,
				url:'index.registro'
			},
			{
				nombre:'Estadistica',
				background:'yellowG',
				icon:'show_chart',
				col:'1',
				row:'1',
				size:'84',
				permiso:true,
				url:'index.estadisticas'
			}
		];

		hm.seccionesAdmin = [
			{
				nombre:'Consulta General',
				background:'bgm-brown',
				icon:'search',
				col:'2',
				row:'1',
				size:'84',
				permiso:true,
				url:'index.busquedaGeneral'
			},
			{
				nombre:'Alta Documentos',
				background:'bgm-indigo',
				icon:'style',
				col:'1',
				row:'1',
				size:'84',
				permiso:true,
				url:'index.documentos'
			}
		];

	};

})();