//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('busqueda',busqueda);

    function busqueda($http, $rootScope, api, $q,$filter){

        var servicio = {
            ajustadores:ajustadores,
            clientes: clientes,
            datosExpediente:datosExpediente,
            detalleAtencion : detalleAtencion,
            detalleFolio : detalleFolio,
            documentosAtencion:documentosAtencion,
            documentoSolicitud:documentoSolicitud,
            productoAtencionDocumentos:productoAtencionDocumentos,
            productos: productos,
            productosCliente : productosCliente,
            registros : registros,
            riesgos:riesgos,
            tipos: tipos,
            tiposDocumento:tiposDocumento,
            tiposAtencion:tiposAtencion

        };

        return servicio;

        //funcion que convierte json en parametros get
        function serializeObj(obj) {
            var result = [];

            for (var property in obj)
                result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

            return result.join("&");
        }


        //tipos de ajustadores por localidad
        function ajustadores(){
            return $http.get(api + 'busqueda/ajustadores/' + $rootScope.localidad ,{timeout: 10000});
        };

        //funcion que busca los documentos dados de alta segun la atencion y el producto
        function productoAtencionDocumentos(datos){
            var parametros = serializeObj(datos);
            return $http.get( api + 'busqueda/productoAtencionDocumentos?' + parametros,{timeout: 10000});
        }

        //consulta de clientes activos
        function clientes(){
            return $http.get(api + 'busqueda/clientes',{timeout: 10000});
        };

        // datos del folio
        function datosExpediente(folio){

            var promesa        = $q.defer(),
                //cargamos los datos de la primera atencion
                atenciones     = $http.get(api + 'busqueda/atenciones/' + folio ,{timeout: 10000}),
                //consltamos el historial del folio
                historial      = $http.get(api + 'busqueda/historial/' + folio ,{timeout: 10000}),
                //consulta autorizaciones
                autorizaciones = $http.get(api + 'busqueda/autorizaciones/' + folio ,{timeout: 10000}),
                //consulta tickets
                tickets        = $http.get(api + 'busqueda/tickets/' + folio ,{timeout: 10000});
                //solicitudes
                solicitudes    = $http.get(api + 'busqueda/solicitudes/' + folio ,{timeout: 10000});
            
            $q.all([tickets,historial,autorizaciones,atenciones]).then(function (data){

                var atenciones = data[3].data;
                var primera = $filter('filter')(atenciones,{TIA_clave:1});
                var subsecuencias = $filter('filter')(atenciones,{TIA_clave:2});
                var rehabilitaciones = $filter('filter')(atenciones,{TIA_clave:3});

                var datos = {
                    tickets : data[0].data,
                    historial:data[1].data,
                    autorizaciones:data[2].data,
                    primera:primera,
                    subsecuencias:subsecuencias,
                    rehabilitaciones:rehabilitaciones
                }

                promesa.resolve(datos);

            }, function (error){
                promesa.reject('error en conexión');
            });

            return promesa.promise;
        };

        //consulta el detalle de la atencion
        function detalleAtencion(atencion){
            var promesa  = $q.defer(),
                detalle  = $http.get( api + 'busqueda/detalleAtencion/' + atencion );

            
            $q.when(detalle).then(function (datos){

                var datos = {
                    tipos : datos.data.tipos,
                    imagenes:datos.data.imagenes,
                    info:datos.data.info,
                    requisitos:datos.data.requisitos,
                    anotaciones:datos.data.anotaciones
                }

                promesa.resolve(datos);

            }, function (error){
                promesa.reject('error en conexión');
            });

            return promesa.promise;
        };

        //consulta el detalle del folio
        function detalleFolio(folio){
            return $http.get(api + 'busqueda/detalleFolio/' + folio,{timeout: 10000});
        };

        //consulta de documentos por producto y tipo de atencion
        function documentosAtencion(atencion,producto){
            return $http.get(api + 'busqueda/documentos/' + atencion + '/' + producto,{timeout: 10000});
        };


        //busqueda de documentos para la solicitud de autorización
        function documentoSolicitud(){
            return $http.get(api + 'busqueda/documentoSolicitud');
        }

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


        // consulta de registros
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

        function documentosAtencion(producto,atencion){
            return $http.get(api + 'busqueda/documentos/' + producto + '/' + atencion,{timeout: 10000});
        }

        //tipos de telefono
        function tipos(){
            return $http.get(api + 'busqueda/tiposTelefono',{timeout: 10000});
        };

        //tipos de documentos
        function tiposDocumento(){
            return $http.get(api + 'busqueda/tiposDocumento',{timeout: 10000});
        };

        //tipos de atenciones
        function tiposAtencion(){
            return $http.get(api + 'busqueda/tiposAtencion',{timeout: 10000});
        };


    }

})();