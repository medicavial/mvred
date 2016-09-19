//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('registros',registros);

    function registros($resource, api){

        return $resource( api + 'busqueda/registros',{},{'get':{method:'GET',timeout:15000}});

    }

})();