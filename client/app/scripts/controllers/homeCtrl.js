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
				row:'2',
				size:'104',
				permiso:true,
				url:'index.registro'
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
				nombre:'Formatos',
				background:'greenG',
				icon:'insert_drive_file',
				col:'1',
				row:'1',
				size:'84',
				permiso:true,
				url:'index.registro'
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
				col:'2',
				row:'1',
				size:'84',
				permiso:true,
				url:'index.registro'
			},
			{
				nombre:'Ayuda',
				background:'orangeG',
				icon:'help',
				col:'2',
				row:'1',
				size:'84',
				permiso:true,
				url:'index.registro'
			}
		];

	};

})();