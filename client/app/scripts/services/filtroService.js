//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('filtro',filtro);

    function filtro($filter){

        var servicio = {
            consulta:consulta
        };

        return servicio;

        //Consulta las atenciones en el año segementadas por mes
        function consulta(listado,valor){
            return $filter('filter')(listado,{'TID_claveint':valor},true);
        };


    }

})();