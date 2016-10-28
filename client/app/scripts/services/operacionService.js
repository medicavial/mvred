//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('operacion',operacion);

    operacion.$inject = ['$http', '$rootScope','$q','api','Upload', 'publicfiles', 'registro'];

    function operacion($http, $rootScope, $q, api, Upload, publicfiles, registro){

        var operacion = {
            creaAtencion:creaAtencion,
            eliminaImagen:eliminaImagen,
            subirFactura:subirFactura,
            ingresaSolicitud:ingresaSolicitud,
            guardaDocumento:guardaDocumento,
            registroPaciente:registroPaciente,
            registroSiniestro:registroSiniestro,
            solicitaAutorizacion:solicitaAutorizacion,
            solicitaCancelacion:solicitaCancelacion,
            subirImagenes:subirImagenes
        };

        return operacion;


        //funcion para crear nueva atencion
        function creaAtencion(datos){
            return $http.post(api + 'operacion/creaAtencion',datos);
        }

        //function para eliminar imagen o PDF/XMl 
        function eliminaArchivo(archivo){
            return $http.post(api+'operacion/eliminaArchivo',archivo);
        }

        //funcion para subir el xml o pdf
        function subirFactura(archivo,atencion,xml,pdf){


            var promesa = $q.defer(),
                factura = archivo[0];
            //mandamos el tipo de archivo segun sea el archivo
            if (factura.type == 'text/xml') {
                if (!xml) {
                    var tipo = 29;
                    xml = true;                    
                }else{
                    promesa.reject('No puedes subir mas de un archivo de XML');
                }
            }else{
                if (!pdf) {
                    var tipo = 30; 
                    pdf = true;                   
                }else{
                    promesa.reject('No puedes subir mas de un archivo de PDF');
                }                
            };
            //regresamos cada respuesta en el arreglo
            Upload.upload({
                url:  api+'operacion/factura',
                data: {file: factura, usuario: $rootScope.id,atencion:atencion,tipo:tipo}
            }).progress(function (evt) {
                
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                promesa.notify({porcentaje:progressPercentage});

            }).then(function (resp){

                //siempre debe haber un archivo
                console.log(resp);

                var respuesta = {
                    xml : xml,
                    pdf : pdf,
                    datosArchivo:'',
                    datosXML : ''
                }

                respuesta.datosArchivo = resp.data.archivo;

                if (respuesta.xml) {

                    leeXML(atencion).then(function (datos){
                        console.log(datos);
                        respuesta.datosXML = datos;
                        promesa.resolve(respuesta);
                    },function (error){
                        promesa.reject(error);
                    });

                }else{
                    
                    promesa.resolve(respuesta);

                }



            },function (error){
                promesa.reject('Ocurrio un problema intente de nuevo');
            });

            return promesa.promise;

        }

        //function para guardar la relacion producto , atencion y tipo de documento 
        function guardaDocumento(datos){
            return $http.post(api+'operacion/documentos',datos);
        }


        function leeXML(atencion){

            var promesa = $q.defer();

            $http.get(api +'operacion/muestraXML/' + atencion).success(function (data){
                var x2js   = new X2JS();
                var datosXML  = x2js.xml_str2json(data);
                promesa.resolve(datosXML);

            }).error(function (error){
                promesa.reject('Error de lectura');
            });


            return promesa.promise;

        }

        //tipos de registroPaciente por localidad
        function registroPaciente(datos){
            return $http.post(api + 'operacion/registraFolio', datos,{timeout: 10000});
        };

        function registroSiniestro(datos){
            return $http.post(api + 'operacion/registraSiniestro', datos ,{timeout: 10000});
        };

        function solicitaAutorizacion(datos){
            return $http.post(api + 'operacion/autorizacion', datos ,{timeout: 10000});
        };

        function solicitaCancelacion(datos){
            return $http.post(api + 'operacion/cancelacion', datos ,{timeout: 10000});
        };

        //function para subir imagen con el tipo de archivo
        function subirImagenes(tipo,imagenes,atencion){

            var promesa = $q.defer();
            var file = imagenes[0];
                
            if (!file.$error) {
                // console.log(file);
                Upload.upload({
                    url: api+'operacion/imagenes',
                    data: {file: file, usuario: $rootScope.id,tipo:tipo,atencion:atencion}
                })

                .then(function (resp) {
                    promesa.resolve(resp.data);
                }, function (resp) {
                    if (isNaN(resp)) {
                        promesa.reject('Archivo con problemas');
                    }else{
                        promesa.reject(resp.data.flash);                            
                    }
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    promesa.notify(progressPercentage);
                });

            }else{
                promesa.reject('Formato Invalido');
            }

            return promesa.promise;

        }

        function imagenServer(file,tipo,atencion){

            var promesa = $q.defer();

            Upload.upload({
                url: api+'operacion/imagenes',
                data: {file: file, usuario: $rootScope.id,tipo:tipo,atencion:atencion}
            })

            .then(function (resp) {
                promesa.resolve(resp.data);
            }, function (resp) {
                if (isNaN(resp)) {
                    promesa.reject('Archivo con problemas');
                }else{
                    promesa.reject(resp.data.flash);                            
                }
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                promesa.notify(progressPercentage);
            });

            return promesa.promise;
        }

        function ingresaSolicitud(datos){
            return $http.post(api + 'operacion/solicitud', datos ,{timeout: 10000});
        }

    }

})();