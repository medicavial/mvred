//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('operacion',operacion);

    operacion.$inject = ['$http', '$rootScope','$q','api','Upload'];

    function operacion($http, $rootScope, $q, api, Upload){

        var operacion = {
            eliminaImagen:eliminaImagen,
            registroPaciente:registroPaciente,
            registroSiniestro:registroSiniestro,
            subirImagenes:subirImagenes
        };

        return operacion;


        //function para eliminar imagen 
        function eliminaImagen(imagen){
            return $http.post(api+'operacion/eliminaImagen',imagen);
        }

        //tipos de registroPaciente por localidad
        function registroPaciente(datos){
            return $http.post(api + 'operacion/registraFolio', datos,{timeout: 10000});
        };

        function registroSiniestro(datos){
            return $http.post(api + 'operacion/registraSiniestro', datos ,{timeout: 10000});
        };

        //function para subir imagenes con el tipo de archivo
        function subirImagenes(folio,tipo,imagenes,etapa,entrega){

            var promesa = $q.defer();


            for (var i = 0;  i < imagenes.length; i++) {
                
                var file = imagenes[i];

                if (!file.$error) {
                    // console.log(file);
                    Upload.upload({
                        url: api+'operacion/imagenes',
                        data: {file: file, usuario: $rootScope.id,folio:folio, tipo:tipo,etapa:etapa,entrega:entrega}
                    }).then(function (resp) {
                        promesa.resolve(resp.data);
                    }, function (resp) {
                        promesa.reject(resp.data.flash);
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        promesa.notify(progressPercentage);
                    });  

                }else{
                    promesa.reject('Formato Invalido');
                }

            };

            return promesa.promise;

        }

    }

})();