//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('reportes',reportes);

    function reportes($http, $rootScope, api, $q){

        var servicio = {
            atencionesAnio:atencionesAnio,
            atencionesMes:atencionesMes
        };

        return servicio;


        //Consulta las atenciones en el año segementadas por mes
        function atencionesAnio(){
            return $http.get(api + 'reportes/atenciones/anio/' + $rootScope.unidad ,{timeout: 10000});
        };

        //Consulta las atenciones en el mes segementadas por semana
        function atencionesMes(){
            return $http.get(api + 'reportes/atenciones/mes/' + $rootScope.unidad ,{timeout: 10000});
        };

    }

})();