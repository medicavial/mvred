//directiva que detecta cuando se deja de arrastrar un elemento

(function(){


    'use strict';

    angular
    .module('app')
    .directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
              element.on('load', function() {
                // Set visibility: true + remove spinner overlay
                  element.removeClass('spinner-hide');
                  element.addClass('spinner-show');
                  element.parent().find('span').remove();
              });
              scope.$watch('ngSrc', function() {
                // Set visibility: false + inject temporary spinner overlay
                  element.addClass('spinner-hide');
                  // element.parent().append('<span class="spinner"></span>');
              });
            }
        };
    })
    .directive('ngMouseWheelUp', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
                // cross-browser wheel delta
                var event = window.event || event; // old IE support
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        
                if(delta > 0) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngMouseWheelUp);
                    });
                
                  // for IE
                  event.returnValue = false;
                  // for Chrome and Firefox
                  if(event.preventDefault) event.preventDefault();                        
                }
            });
        };
    })
    .directive('ngMouseWheelDown', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
                // cross-browser wheel delta
                var event = window.event || event; // old IE support
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        
                if(delta < 0) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngMouseWheelDown);
                    });

                  // for IE
                  event.returnValue = false;
                  // for Chrome and Firefox
                  if(event.preventDefault) event.preventDefault();                        
                }
            });
        };
    });

})();