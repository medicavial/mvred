(function(){

	'use strict';

	angular.module('app')
	.controller('ayudaCtrl',ayudaCtrl)
	.controller('videoCtrl',videoCtrl);

	ayudaCtrl.$inject = ['$rootScope', '$mdDialog'];
	videoCtrl.$inject = ['$mdDialog','video'];

	function ayudaCtrl($rootScope, $mdDialog){

		var au = this;

		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Ayuda';

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
		      controller: 'videoCtrl',
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

	function videoCtrl($mdDialog,video){
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