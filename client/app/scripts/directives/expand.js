(function(){

    'use strict';
    
    angular
    .module('app')
    .directive('expandColor', function ($animate) {
        return {
            link: link
        };

        function link(scope, element, attrs){

            var color = attrs.expandColor;
            console.log(color);
            element.on('click',function(){

                var iDiv = document.createElement('div');
                iDiv.className = 'box';
                element.append(iDiv);
                angular.element(iDiv).addClass(color);
                angular.element(iDiv).addClass('active');

            });



        }
        
    });

})();