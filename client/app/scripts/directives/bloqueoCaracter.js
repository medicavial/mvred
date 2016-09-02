(function(){

    'use strict';
    
    angular
    .module('app')
    .directive('bloqueo', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

                var caracter = scope.$eval(attrs.bloqueo);

                //funcion que rellena folios 
                element.on('keydown', function(e){

                    if (e.keyCode == caracter) {
                        e.preventDefault();
                    }
                    
                });

            }

        };
        
    });

})();