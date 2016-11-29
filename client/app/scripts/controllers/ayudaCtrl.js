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
					var video = 'http://medicavial.net/mvred/videos/2_Conociendo_a_M%C3%A9dicaVial.mp4';
					break;
				case 2:
					var video = 'http://medicavial.net/mvred/videos/3.2_Registro_Web.mp4';
					break;
				case 3:
					var video = 'http://medicavial.net/mvred/videos/4_Autorizaciones_Especiales_y_Salida_de_Paquete.mp4';
					break;
			}

			$mdDialog.show({
		      controller: 'videoCtrl',
		      controllerAs:'vi',
		      templateUrl: 'videos.html',
		      locals: { video: video },
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: true
		    });

		}

		au.directorio = function(ev){

			$mdDialog.show({
				templateUrl: 'directorio.html',
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