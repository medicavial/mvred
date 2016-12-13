//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('reportes',reportes);

    function reportes($http, $rootScope, api, $q, fechas){

        var servicio = {
            atencionesAnio:atencionesAnio,
            atencionesMes:atencionesMes,
            detalleEstadistica:detalleEstadistica,
            estadisticas:estadisticas,
            estadisticasXfecha:estadisticasXfecha,
            notificacionUnidad:notificacionUnidad
        };

        return servicio;

        //funcion que convierte json en parametros get
        function serializeObj(obj) {
            var result = [];

            for (var property in obj)
                result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

            return result.join("&");
        }

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

            var fechaIniRep = moment(fechas.fechaIni).format('YYYY-MM-DD');
            var fechaFinRep = moment(fechas.fechaFin).format('YYYY-MM-DD');

            var datos = {
                unidad:$rootScope.unidad,
                fechaIni:fechaIniRep,
                fechaFin:fechaFinRep,
                tipo:tipo
            };

            var parametros = serializeObj(datos);

            return $http.get(api + 'reportes/listado?' + parametros ,{timeout: 10000});  
        }

        //Consulta las estadisticas del mes
        function estadisticasXfecha(fechaIni,fechaFin){
            
            var fechaIniRep = moment(fechas.fechaIni).format('YYYY-MM-DD');
            var fechaFinRep = moment(fechas.fechaFin).format('YYYY-MM-DD');

            var datos = {
                unidad:$rootScope.unidad,
                fechaIni:fechaIniRep,
                fechaFin:fechaFinRep
            };

            var parametros = serializeObj(datos);

            return $http.get(api + 'reportes/estadistica?' + parametros ,{timeout: 10000});
        };

        //funcion global
        function estadisticas(){

            console.log('entro');
            
            var promesa  = $q.defer(),
                es       = estadisticasXfecha(),
                atnMes   = atencionesMes(),
                atnAnio  = atencionesAnio();

            $q.all([atnMes,atnAnio,es]).then(function (data){
                promesa.resolve(data);
            },function (error){
                promesa.reject('Error');
            });

            return promesa.promise;
        }

        //Consulta las notificaciones de sus faltantes en la unidad
        function notificacionUnidad(){
            return $http.get(api + 'reportes/notificacionUnidad/' + $rootScope.unidad ,{timeout: 10000});
        };

    }

})();