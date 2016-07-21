(function(){

  'use strict';

  angular
  .module('app')
  .animation('.transicion',transicion);

  //funcion para animacion
  function transicion($resource,api){

    var animacion = {
        enter:enter,
        leave:leave

    };

    return animacion;

    function enter(element, done){
      element.css('opacity',0);
    }

    function leave(element, done){
      element.css('opacity',0);
    }
      
  }

})();