(function(){

	'use strict';

	angular.module('app')
	.controller('formatosCtrl',formatosCtrl)
	.controller('archivoCtrl',archivoCtrl);

	formatosCtrl.$inject = ['$rootScope', '$mdDialog'];
	archivoCtrl.$inject = ['$mdDialog','video'];

	function formatosCtrl($rootScope, $mdDialog){

		var au = this;

		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Fomatos';

		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		au.video = function(ev,opcion){

			switch(opcion){
				case 1:
					var video = 'http://medicavial.net/mvred/videos/3_Numero_de%20faltas_y_retardos%20LIC_MARIANA_SANCHEZ.mp4';
					break;
				case 2:
					var video = 'http://medicavial.net/mvred/videos/5_Expedientes_completos_ING_ALFREDO_GUTIERREZ.mp4';
					break;
				case 3:
					var video = 'http://medicavial.net/mvred/videos/7_Tiempo_de_espera_ING_ALFREDO_GUTIERREZ.mp4';
					break;
			}

			$mdDialog.show({
		      controller: 'archivoCtrl',
		      controllerAs:'vi',
		      templateUrl: 'views/videos.html',
		      locals: { video: video },
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: true
		    });

		}

		au.directorio = function(ev){

			$mdDialog.show({
				templateUrl: 'views/directorio.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: true,
				controller:function($scope,$mdDialog){
					$scope.cerrar = function(){
						$mdDialog.cancel();
					}
				}
		    });

		}

	};

	function archivoCtrl($mdDialog,video){
		var vi = this;
		vi.video = video;

		vi.options = {
            loop: true
        };
        
		vi.info = {
            sources: [
                {
                    src: video,
                    type: 'video/mp4'
                }
            ]
        };

		vi.cancel = function(){
			$mdDialog.hide();
		}
	}



})();