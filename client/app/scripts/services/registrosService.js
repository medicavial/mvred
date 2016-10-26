//servicio que busca en expediente todos los registros segun unidad
(function(){

    'use strict';
    
    angular.module('app')
    .factory('registros',registros);

    function registros($resource, api){

        return $resource( api + 'busqueda/registros',{},{'get':{method:'GET',timeout:15000}});

    }

})();