//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('operacion',operacion);

    function operacion($http, $rootScope, $q, api){

        var operacion = {
            registroPaciente:registroPaciente,
            registroSiniestro:registroSiniestro
        };

        return operacion;


        //tipos de registroPaciente por localidad
        function registroPaciente(datos){
            return $http.post(api + 'operacion/registraFolio', datos,{timeout: 10000});
        };

        function registroSiniestro(datos){
            return $http.post(api + 'operacion/registraSiniestro', datos ,{timeout: 10000});
        };

    }

})();