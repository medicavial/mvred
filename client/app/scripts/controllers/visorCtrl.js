(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('visorCtrl',visorCtrl)
	
	visorCtrl.$inject = ['$scope','$mdDialog','imagen','registro'];


	function visorCtrl($scope,$mdDialog,imagen,registro){

		$scope.archivo = imagen.archivo;
		$scope.imagen = imagen.clave;

		$scope.cerrar = function(){
			$mdDialog.cancel();
		}

		$scope.picture = function(){
	        //se obtiene la extension del archivo
	        var extn = $scope.imagen.split(".").pop();

	        if (extn == 'jpg' || extn == 'jpeg' || extn == 'png' || extn == 'PNG' ) {
	            return true;
	        }else{
	            return false;
	        }
	    }

	    $scope.file = function(){
	        //se obtiene la extension del archivo
	        var extn = $scope.imagen.split(".").pop();
	        if (extn == 'pdf' || extn == 'PDF') {
	            return true;
	        }else{
	            return false;
	        }
	    }

		$scope.obtenerFrame = function(src) {
	        return registro + $scope.archivo + '/' + $scope.imagen;
	        // return 'http://localhost/registro/' + $scope.archivo + '/' + $scope.imagen;
	    };
	}

})();