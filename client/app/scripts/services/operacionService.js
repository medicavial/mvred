//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('operacion',operacion);

    operacion.$inject = ['$http', '$rootScope','$q','api','Upload', 'publicfiles', 'registro','filtro', '$window'];

    function operacion($http, $rootScope, $q, api, Upload, publicfiles, registro,filtro, $window){

        var operacion = {
            autorizaImagen:autorizaImagen,
            cambiarEstatus:cambiarEstatus,
            creaAtencion:creaAtencion,
            descargaArchivo:descargaArchivo,
            eliminaArchivo:eliminaArchivo,
            subirFactura:subirFactura,
            imagenOCR:imagenOCR,
            ingresaSolicitud:ingresaSolicitud,
            guardaDocumento:guardaDocumento,
            guardaNotas:guardaNotas,
            registroPaciente:registroPaciente,
            registroSiniestro:registroSiniestro,
            solicitaAutorizacion:solicitaAutorizacion,
            solicitaCancelacion:solicitaCancelacion,
            subirImagenes:subirImagenes
        };

        return operacion;

        // funcion que aurotiza imagen 
        function autorizaImagen(imagen,atencion){
            return $http.post(api + 'operacion/autorizaImagen/'+ atencion,imagen);
        }

        //funcion para cambiar de estatus la atencion
        function cambiarEstatus(atencion,valor){
            return $http.get(api + 'operacion/cambiarEstatus/'+ atencion + '/' + valor + '/' + $rootScope.id ,{timeout: 10000});
        };

        //funcion para crear nueva atencion
        function creaAtencion(datos){
            return $http.post(api + 'operacion/creaAtencion',datos);
        }

        function descargaArchivo(archivo){
            $window.open(api + 'operacion/descargaArchivo?archivo=' + archivo, '_balnk');
        }

        //function para eliminar imagen o PDF/XMl 
        function eliminaArchivo(archivo){
            return $http.post(api+'operacion/eliminaArchivo',archivo);
        }

        //funcion para subir el xml o pdf
        function subirFactura(archivo,atencion,xml,pdf){


            var promesa = $q.defer(),
                factura = archivo[0];

            var xmlSubido = false;
            var pdfSubido  = false;
                
            //mandamos el tipo de archivo segun sea el archivo
            if (factura.type == 'text/xml') {
                if (!xml) {
                    var tipo = 29;
                    xmlSubido = true;                    
                }else{
                    promesa.reject('No puedes subir mas de un archivo de XML');
                }
            }else{
                if (!pdf) {
                    var tipo = 30; 
                    pdfSubido  = true;                   
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
                    xml : xmlSubido,
                    pdf : pdfSubido,
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

        //function para guardar la relacion producto , atencion y tipo de documento 
        function guardaNotas(nota,atencion){

            var datos = {
                nota:nota,
                atencion:atencion
            }

            return $http.post(api+'operacion/guardaNotas',datos);

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

        function imagenOCR(files){

            var promesa = $q.defer(),
                file = files[0];

            Upload.base64DataUrl(file).then(function (url){

                var textos = url.split('data:image/png;base64,');

                // console.log(textos);
                
                var body = {
                    requests: {
                        image: {
                            content: textos[1]
                        },
                        features: [
                            {
                                type: 'TEXT_DETECTION',
                                maxResults: 10
                            },
                            {
                                type: 'LOGO_DETECTION',
                                maxResults: 10
                            }
                        ]
                    }
                }

                var url = 'https://vision.googleapis.com/v1/images:annotate\?key\=AIzaSyBv-xkwdgjF7xND0CjOF4EFN9jccXC8fJg'


                $http.post(url,body).then(
                    function (resp){    

                        var datos = resp.data.responses[0];

                        console.log(datos);

                        var logo = datos.logoAnnotations[0].description;

                        var info = datos.textAnnotations;

                        // console.log(logo);
                        // console.log(info);

                        if (logo == 'Qualitas') {


                            // la palabra autorizacion se encuentra 3 veces 
                            var encontradasAut = filtro.buscaParametro(info,'Autorizacion');
                            //tomamos el index
                            var index = info.indexOf(encontradasAut[3]);
                            //y le sumamos 4 posiciones
                            var folioAutorizacion = info[index + 4].description;

                            // la palabra  
                            var encontradasPol = filtro.buscaParametro(info,'Polizia');
                            //tomamos el index
                            var indexPol = info.indexOf(encontradasPol[1]);
                            //y le sumamos 4 posiciones
                            var poliza = info[indexPol + 1].description;

                            // la palabra 
                            var encontradasSin = filtro.buscaParametro(info,'Siniestro');
                            //tomamos el index
                            var indexSin = info.indexOf(encontradasSin[1]);
                            //y le sumamos 4 posiciones
                            var siniestro = info[indexSin + 1].description;

                            // la palabra 
                            var encontradasRep = filtro.buscaParametro(info,'Reporte');
                            //tomamos el index
                            var indexRep = info.indexOf(encontradasRep[1]);
                            //y le sumamos 4 posiciones
                            var reporte = info[indexRep + 1].description;


                            // la palabra 
                            var encontradasEl = filtro.buscaParametro(info,'Electronico');
                            //tomamos el index
                            var indexEl = info.indexOf(encontradasEl[1]);
                            //y le sumamos 4 posiciones
                            var folioElec = info[indexEl + 1].description + info[indexEl + 2].description;


                            // la palabra 
                            var encontradasCo = filtro.buscaParametro(info,'Cobertura');
                            //tomamos el index
                            var indexCo = info.indexOf(encontradasCo[1]);
                            //y le sumamos 4 posiciones
                            var cobertura = info[indexCo + 1].description;

                            // la palabra 
                            var encontradasNo = filtro.buscaParametro(info,'Nombre');
                            //tomamos el index
                            var indexNo = info.indexOf(encontradasNo[1]);
                            //y le sumamos 4 posiciones
                            var Lesionado = info[indexNo + 1].description + ' ' + info[indexNo + 2].description + ' ' + info[indexNo + 3].description;

                            console.log(folioAutorizacion);
                            console.log(reporte);
                            console.log(poliza);
                            console.log(siniestro);
                            console.log(folioElec);

                            console.log(cobertura);
                            console.log(Lesionado);

                        };

                    },function (err){
                        console.log(err);
                    }
                );
                
            });

            return promesa.promise;
        }

        function ingresaSolicitud(datos){
            return $http.post(api + 'operacion/solicitud', datos ,{timeout: 10000});
        }

    }

})();