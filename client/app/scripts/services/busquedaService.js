//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('busqueda',busqueda);

    function busqueda($http, $rootScope, api, $q){

        var servicio = {
            ajustadores:ajustadores,
            clientes: clientes,
            datos:datos,
            detalleFolio : detalleFolio,
            productos: productos,
            productosCliente : productosCliente,
            registros : registros,
            riesgos:riesgos,
            tipos: tipos

        };

        return servicio;


        //tipos de ajustadores por localidad
        function ajustadores(){
            return $http.get(api + 'busqueda/ajustadores/' + $rootScope.localidad ,{timeout: 10000});
        };

        //consulta de clientes activos
        function clientes(){
            return $http.get(api + 'busqueda/clientes',{timeout: 10000});
        };

        //consulta el detalle del folio
        function detalleFolio(folio){
            return $http.get(api + 'busqueda/detalleFolio/' + folio,{timeout: 10000});
        };

        //consulta de productos activos
        function productos(){
            return $http.get(api + 'busqueda/productos',{timeout: 10000});
        };

        //productos por compañia y localidad
        function productosCliente(cliente,localidad){
            return $http.get(api + 'busqueda/productos/'+ cliente + '/' + localidad ,{timeout: 10000});
        };

        //consulta de riesgos afectados
        function riesgos(){
            return $http.get(api + 'busqueda/riesgos',{timeout: 10000});
        };

        function registros(datos){

            console.log(datos);

            var promesa    = $q.defer(),
                parametros = 'unidad=' + $rootScope.unidad;

            if (datos !== undefined) {

                if (datos.folio) {
                    parametros = parametros + '&folio=' + datos.folio;
                };

                if (datos.lesionado) {
                    parametros = parametros + '&lesionado=' + datos.lesionado;  
                };
            };
            
            var consulta   = $http.get(api + 'busqueda/registros?' + parametros ,{timeout: 10000});

            $q.when(consulta).then(
                function (datos){
                    console.log(datos);
                    if (datos.data.length > 0) {
                        promesa.resolve(datos.data);
                    }else{
                        promesa.reject('No se encontraron coincidencias.');
                    }
                },function (error){
                    promesa.reject('Ocurrio un error intentelo nuevamente');
                });

            return promesa.promise;
             
        }

        // tickets del folio
        function datos(folio){

            var promesa = $q.defer(),
                tickets = $http.get(api + 'busqueda/tickets/' + folio ,{timeout: 10000});
            
            $q.all([tickets]).then(function (data){

                datos = {
                    tickets : data[0].data
                }
                promesa.resolve(datos);

            }, function (error){
                promesa.reject('error en conexión');
            });

            return promesa.promise;
        };


        //tipos de telefono
        function tipos(){
            return $http.get(api + 'busqueda/tipos',{timeout: 10000});
        };


    }

})();