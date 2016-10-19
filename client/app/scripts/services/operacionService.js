//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('operacion',operacion);

    operacion.$inject = ['$http', '$rootScope','$q','api','Upload', 'publicfiles'];

    function operacion($http, $rootScope, $q, api, Upload, publicfiles){

        var operacion = {
            creaAtencion:creaAtencion,
            eliminaImagen:eliminaImagen,
            factura:factura,
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

        //function para eliminar imagen 
        function eliminaImagen(imagen){
            return $http.post(api+'operacion/eliminaImagen',imagen);
        }

        //funcion para leer los xml
        function factura(archivo,folio,etapa,entrega){

            var promesa = $q.defer();

            var file = archivo[0];

            if (!file.$error) {
                console.log(file);
                // Upload.upload({
                    
                //     url: api+'operacion/factura',
                //     data: {file: file, usuario: $rootScope.id,folio:folio, tipo:tipo,etapa:etapa,entrega:entrega}
                // }).then(function (resp) {


                //     promesa.resolve(resp.data);


                // }, function (resp) {

                //     if (isNaN(resp)) {
                //         promesa.reject('Archivo con problemas');
                //     }else{
                //         promesa.reject(resp.data.flash);                            
                //     }

                // }, function (evt) {
                //     var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //     promesa.notify(progressPercentage);
                // });  

            }else{
                promesa.reject('Formato Invalido');
            }


            return promesa.promise;
        }

        //function para guardar la relacion producto , atencion y tipo de documento 
        function guardaDocumento(datos){
            return $http.post(api+'operacion/documentos',datos);
        }


        function leeXML(xml,folio){
            var promesa = $q.defer();

            $http.get(publicfiles + '/factura/' + folio + '/' + xml + '.xml').success(function (data){

                datosXML  = x2js.xml_str2json(data);
                var datos = {
                    foliofiscal : datosXML.Comprobante.Complemento.TimbreFiscalDigital._UUID,
                    rfc : datosXML.Comprobante.Receptor._rfc,
                    emisor : datosXML.Comprobante.Emisor._nombre,
                    receptor : datosXML.Comprobante.Receptor._nombre,
                    subtotal : datosXML.Comprobante._subTotal,
                    iva : datosXML.Comprobante.Impuestos.Traslados.Traslado._importe,
                    total : datosXML.Comprobante._total,
                    descuento : datosXML.Comprobante._descuento,
                    fechaemision : datosXML.Comprobante._fecha
                }

                promesa.resolve(datos);

            }).error(function (error){
                promesa.reject('No se encontro la factura');
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