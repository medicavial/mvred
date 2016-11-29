//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('auth',auth);

    function auth($http, api, $state, webStorage,$rootScope,mensajes){
        return{
            login : function(credenciales)
            {   

                $http.post(api+'login',credenciales)
                .success(function (data){

                    // console.log(data);
                    webStorage.local.clear();
                    $rootScope.cargando = false;
                    

                    webStorage.session.add('username',data.Usu_login);
                    webStorage.session.add('nombre',data.Usu_nombre);
                    webStorage.session.add('id',data.Usu_login);
                    webStorage.session.add('localidad',data.LOC_claveint);
                    webStorage.session.add('unidad',data.Uni_clave);
                    webStorage.session.add('nombreUni',data.Uni_nombrecorto);
                    webStorage.session.add('permisos',JSON.stringify(data))

                    $rootScope.username = webStorage.session.get('username');
                    $rootScope.nombre = webStorage.session.get('nombre');
                    $rootScope.id = webStorage.session.get('id');
                    $rootScope.localidad = webStorage.session.get('localidad');
                    $rootScope.unidad = webStorage.session.get('unidad');
                    $rootScope.nombreUni = webStorage.session.get('nombreUni');
                    $rootScope.permisos = JSON.parse( webStorage.session.get('permisos') );

                    if (credenciales.guardar) {
                        webStorage.local.add('usuario',JSON.stringify(data));
                    }

                    $state.go('index.home');

                }).error(function (data){

                    if (data) {
                        mensajes.alerta(data.flash,'error center-dialog','top','error');
                    }else{
                        mensajes.alerta('Error en conexión intentalo nuevamente','error center-dialog','top','error');
                    }
                    $rootScope.cargando = false;
                });

            },
            logout : function()
            {	
            	webStorage.session.clear();
                $http.get(api+'logout');
            	$state.go('login');
            },
            verify : function(api)
            {
                
            }
        }
    }

})();