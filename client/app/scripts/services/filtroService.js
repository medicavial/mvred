//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('filtro',filtro);

    function filtro($filter,$q){

        var servicio = {
            consulta:consulta,
            buscaParametro:buscaParametro,
            buscaUnidad:buscaUnidad,
            verificaRequeridos:verificaRequeridos
        };

        return servicio;

        //Consulta las atenciones en el año segementadas por mes
        function consulta(listado,valor){
            return $filter('filter')(listado,{'TID_claveint':valor},true);
        };

        function buscaParametro(arreglo,texto){
            return $filter('filter')(arreglo,{'description':texto});
        }

        function buscaUnidad(arreglo,parametro){

            var promesa = $q.defer();

            var datos =  $filter('filter')(arreglo,{'Uni_clave':parametro},true);

            $q.when(datos).then(function (data){

                promesa.resolve(data[0]);

            })

            return promesa.promise;
        }

        function verificaRequeridos(documentos,subidos){

            //primero filtramos los requeridos
            var documentosRequeridos =  $filter('filter')(documentos,{'ATD_requerido':1},true);
            var promesa = $q.defer(),
                faltantes = [];

            // recorremos los documentos que se requieren 
            angular.forEach(documentosRequeridos,function (documento){

                // console.log(subidos);
                //buscamos los requeridos en los archivos subidos
                var documentosSubidos =  $filter('filter')(subidos,{'tipo':documento.TID_claveint},true);

                //en caso de no encontrar lo toma como faltante 
                if (documentosSubidos.length == 0) {
                    faltantes.push(documento);
                };

            });

            //verificamos el resultado de faltantes
            $q.when(faltantes).then(function (res){

                //si hay faltantes rechaza la consulta 
                if (res.length > 0) {
                    promesa.reject(res.length);
                }else{
                //si no hay la aprueba
                    promesa.resolve('completo');
                }
            });

            return promesa.promise;
        }


    }

})();