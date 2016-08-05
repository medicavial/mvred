(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('registroCtrl',registroCtrl)
	.controller('telefonoCtrl',telefonoCtrl)

	registroCtrl.$inject = ['$rootScope','datos','busqueda','$mdDialog','$q','$filter','operacion','mensajes', 'publicfiles', '$mdpDatePicker'];
	telefonoCtrl.$inject = ['$mdDialog','tipos','telefonos'];

	function registroCtrl($rootScope,datos,busqueda,$mdDialog, $q, $filter,operacion,mensajes, publicfiles, $mdpDatePicker){

		// console.log(datos);


		// se inciliza el objeto del controlador y la vista
		var vm = this;
		vm.fecha = moment().subtract(25, "year");
		var fecha = new Date(vm.fecha);
		console.log(fecha);


		//variable de error
		var mensajeError = 'Ocurrio un error al guardar intentelo nuevamente';

		// titulo en variable global
		$rootScope.titulo = 'Registro de Paciente';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		// inicializacion de variables
		vm.clientes = datos.clientes;

		vm.paso1 = 'views/registroPaso1.html';
		vm.paso2 = 'views/registroPaso2.html';
		vm.paso3 = 'views/registroPaso3.html';
		vm.paso4 = 'views/registroPaso4.html';

		// se definen las funciones
		vm.inicio = inicio; //funcion para limpiar todos los campos

		vm.agregaTelefono 	   = agregaTelefono; //funcion que graga mas telefonos disponibles
		vm.buscaAjustador      = buscaAjustador; // funcion que filtra la busqueda de ajustadores 
		vm.confirmaProducto    = confirmaProducto; //funcion para seleccionar el producto segun el cliente
		vm.guardaPaciente 	   = guardaPaciente; // funcion para guardar en base de datos los datos del paciente
		vm.guardaSiniestro 	   = guardaSiniestro; // funcion para guardar en base de datos los datos del Siniestro
		vm.verificaProducto    = verificaProducto; // funcion que consulta los productos disponibles segun el usuario
		vm.detalleAjustador    = detalleAjustador; // si elijen a alguien de la lista de ajustadores rellena campos
		vm.resetForms		   = resetForms;
		vm.consultaInfo		   = consultaInfo;
		vm.verificaObligatorio = verificaObligatorio;

		// funciones del controlador
		function agregaTelefono(ev){

			$mdDialog.show({
				controller: 'telefonoCtrl',
				controllerAs: 'tel',
				templateUrl: 'views/agregaTelefono.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: {
					tipos: vm.tipos,
					telefonos : vm.telefonos
				},
				clickOutsideToClose:false,
				fullscreen: true
		    })
		    .then(function(telefonos) {
	      		// console.log(telefonos);
	      		vm.telefonos = telefonos;
		    });

		}

		function buscaAjustador (query) {

			var q = $q.defer(),
				response = query ? $filter( 'filter' )( vm.ajustadores, query ) : vm.ajustadores;
				q.resolve( response );

			return q.promise;

	    }

		function confirmaProducto(producto){

			// console.log(producto);

			if (vm.errorInfo) {
				mensajes.alerta(error,'error','top right','alert');
				consultaInfo();
			}else{
				vm.tabActual = 2;
				vm.step1block = true;
				vm.step2block = true;
				vm.step3block = false;
				vm.imagenProducto = producto.Pro_img;
				vm.datos.producto = producto.Pro_clave;
			}

		}

		function consultaInfo(){
			
			var tipos 	= busqueda.tipos(),
			riesgos  	= busqueda.riesgos(),
			ajustadores = busqueda.ajustadores();

			$q.all([tipos,riesgos,ajustadores]).then(function (data){

				vm.tipos    = data[0].data;
				vm.riesgos    = data[1].data;
				vm.ajustadores    = data[2].data;
				
			},function(error){
				vm.errorInfo = true;
			});

		}

		function detalleAjustador(ajustador){
			
			console.log(ajustador);

			if (ajustador != undefined) {

				vm.datoSiniestro.ajustador = ajustador.AJU_nombre;
				vm.datoSiniestro.telAjustador = ajustador.AJU_tel;
				vm.datoSiniestro.cveAjustador = ajustador.AJU_clavease;
				vm.datoSiniestro.cveAjustadorMv = ajustador.AJU_claveint; 
				vm.ajustadorExiste = true;

			}else{

				vm.ajustadorExiste = false;
				vm.datoSiniestro.telAjustador = '';
				vm.datoSiniestro.cveAjustador = '';
				vm.datoSiniestro.cveAjustadorMv = '';
			}
			
		}

		function guardaPaciente(){

			if (vm.registroForm.$valid) {

				vm.guardando = true;
				// console.log(vm.datos);
				operacion.registroPaciente(vm.datos).success(function (data){

					vm.guardando = false;
					vm.step4block = false;
					vm.tabActual = 3;
					vm.step3block = true;
					vm.datoSiniestro.folio = data.folio;
					vm.imagenFolio = publicfiles + data.codigo;
					vm.registro = data.registro;

					mensajes.alerta(data.respuesta,'success','top right','done_all');

				}).error(function (error){
					
					vm.guardando = false;
					if (error) {
						mensajes.alerta(error,'error','top right','done_all');
					}else{
						mensajes.alerta(mensajeError,'error','top right','done_all');
					}
				});

			};

		}

		function guardaSiniestro(){

			if (vm.siniestroForm.$valid) {

				vm.datoSiniestro.ajustador.toUpperCase();
				// console.log(vm.datoSiniestro);

				vm.guardando = true;

				operacion.registroSiniestro(vm.datoSiniestro).success(function (data){

					vm.guardando = false;
					vm.step5block = false;
					vm.tabActual = 4;
					vm.step4block = true;

					mensajes.alerta(data.respuesta,'success','top right','done_all');

				}).error(function (error){
					
					vm.guardando = false;
					mensajes.alerta(mensajeError,'error','top right','done_all');
				
				});
			}

		}

		function inicio(){

			vm.step1block = false;
			vm.step2block = true;
			vm.step3block = true;
			vm.step4block = true;
			vm.step5block = true;

			vm.consultando = false;
			vm.guardando = false;
			vm.ajustadorExiste = false;
			vm.errorInfo = false;

			vm.tabActual = 0;
			vm.telefonos = [];
			vm.productos = [];
			vm.imagenCliente = '';
			vm.imagenProducto = '';
			vm.imagenFolio = '';
			vm.compania = '';
			vm.registro = '';

			vm.datos = {
				unidad:$rootScope.unidad,
				localidad:$rootScope.localidad,
				usuario:$rootScope.id,
				cliente:'',
				producto:'',
				telefono:'',
				telefonos:vm.telefonos,
				correo:'',
				nombre:'',
				apaterno:'',
				amaterno:'',
				folioInterno:'',
				fechaNac:new Date(vm.fecha)
			}

			vm.datoSiniestro = {
				folio : '',
				tipotel : '',
				poliza : '',
				localidad: $rootScope.localidad,
				cliente : vm.datos.cliente,
				folioElec : '',
				inciso : '',
				siniestro : '',
				reporte : '',
				orden : '',
				bitacora : '',
				ilejible : false,
				ajustador : '',
				ajustadorId : '',
				cveAjustador : '',
				cveAjustadorMv: '',
				telAjustador : '',
				bitacora : '',
				observaciones : '',
				deducible: false,
				reporte: '',
				observacionesDeducible: '',
				fechaAtencion:'',
				extemporaneo:false,
				motivoEx:''
			}

			consultaInfo();

		}

		function resetForms(){
			vm.registroForm.$setPristine();
			vm.siniestroForm.$setPristine();
			inicio();
		
		}

		function verificaObligatorio(){

			if (vm.datoSiniestro.siniestro == '' && vm.datoSiniestro.bitacora == '' && vm.datoSiniestro.reporte == '') {
				return true;
			}else{
				return false;
			}
		}

		function verificaProducto(cliente){

			// console.log(cliente);
			vm.productos = [];
			vm.consultando = true;
			vm.tabActual = 1;
			vm.step2block = false;

			// en caso de que se tenga error
			if (vm.errorInfo) {
				consultaInfo();
			};

			busqueda.productosCliente(cliente.Cia_clave,vm.datos.localidad).success(function(data){
				vm.productos = data;
				vm.consultando = false;
				vm.datos.cliente = cliente.Cia_clave;
				vm.imagenCliente = cliente.Cia_logo;
				vm.compania = cliente.Cia_nombrecorto;

				// en caso de haber solo un producto seleccion de producto automatico
				if (vm.productos.length == 1) {
					var producto = vm.productos[0];
					confirmaProducto(producto)
				};
			});

		}

	};


	function telefonoCtrl($mdDialog,tipos,telefonos){
		
		var tel = this;
		tel.tipos = tipos;
		tel.telefonos = telefonos;

		//funciones

		tel.inicio = inicio;
		tel.agregaTelefono = agregaTelefono;
		tel.cancelar = cancelar;
		tel.ingresa = ingresa;


		//definicion de funciones

		function inicio(){
			tel.telefono = '';
			tel.tipoTel = '';
		}

		function agregaTelefono(){

			tel.telefonos.push({
				telefono:tel.telefono,
				tipo:tel.tipoTel.TT_clave,
				nombre:tel.tipoTel.TT_tipotelefono
			});

			inicio();
		}


		function cancelar() {
			$mdDialog.cancel();
		};

		function ingresa() {
			$mdDialog.hide(tel.telefonos);
		};

	}

})();