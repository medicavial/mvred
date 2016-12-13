(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('imagenCtrl',imagenCtrl)
	
	imagenCtrl.$inject = ['operacion'];


	function imagenCtrl(operacion){

		var img = this;

		img.analizaArchivo = analizaArchivo;

		function analizaArchivo(archivo,ev){
			operacion.imagenOCR(archivo).then(
				function (resp){
					console.log(resp);
				},function (err){
					console.log(err);
				}
			);
		}


	}

})();