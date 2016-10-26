//servicio que busca en expediente todos los registros
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