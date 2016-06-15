//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('busqueda',busqueda);

    function busqueda($http, api){

        var servicio = {
            clientes: clientes,
            productos: productos
        };

        return servicio;

        //consulta de clientes activos
        function clientes(){
            return $http.get(api + 'busqueda/clientes',{timeout: 10000});
        };

        //consulta de productos activos
        function productos(unidad,cliente){
            return $http.get(api + 'busqueda/productos',{timeout: 10000});
        };
    }

})();