//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('ayuda',ayuda);

    function ayuda($mdDialog){

        var servicio = {
            registro1:registro1
        };

        return servicio;

        //Consulta las atenciones en el año segementadas por mes
        function registro1(titulo){

            $mdDialog.show({
                templateUrl: 'views/ayudaDialog.html',
                controllerAs:'vm',
                controller: function($mdDialog){
                    var vm = this;
                    vm.titulo = titulo;

                    vm.cancelar = function(){
                        $mdDialog.cancel();
                    }
                },
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: true
            })
            
            
        };


    }

})();