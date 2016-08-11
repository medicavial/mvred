//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('registrosGlobales',registrosGlobales);

    function registrosGlobales($resource, api){

        return $resource( api + 'busqueda/registrosGlobales',{},{
                get:  {method:'GET', timeout: 10000 },
            });

    }

})();