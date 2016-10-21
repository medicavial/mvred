//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('reportes',reportes);

    function reportes($http, $rootScope, api, $q){

        var servicio = {
            atencionesAnio:atencionesAnio,
            atencionesMes:atencionesMes,
            detalleEstadistica:detalleEstadistica,
            estadisticas:estadisticas
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

        //consulta el listado de los datos estadisticos
        function detalleEstadistica(tipo){
            return $http.get(api + 'reportes/listado/' + $rootScope.unidad + '/' + tipo ,{timeout: 10000});  
        }

        //Consulta las estadisticas del mes
        function estadisticas(){
            return $http.get(api + 'reportes/estadistica/' + $rootScope.unidad ,{timeout: 10000});
        };

    }

})();