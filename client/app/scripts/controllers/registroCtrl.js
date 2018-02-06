(function(){

	// Controlador de registro MV

	'use strict';

	angular.module('app')
	.controller('registroCtrl',registroCtrl)
	.controller('telefonoCtrl',telefonoCtrl)
	.controller('preregistroCtrl',preregistroCtrl)

	registroCtrl.$inject = ['$rootScope','datos','busqueda','$mdDialog','$q','$filter','operacion','mensajes', 'publicfiles', '$mdpDatePicker','ayuda'];
	telefonoCtrl.$inject = ['$mdDialog','tipos','telefonos', 'mensajes'];
	preregistroCtrl.$inject = ['$rootScope', '$scope','$mdDialog', 'listado'];

	function registroCtrl($rootScope,datos,busqueda,$mdDialog, $q, $filter,operacion,mensajes, publicfiles, $mdpDatePicker,ayuda){
		// console.log(datos);
		// se inciliza el objeto del controlador y la vista
		var vm = this;
		vm.fecha = moment().subtract(25, "year");
		var fecha = new Date(vm.fecha);
		// console.log(fecha);


		//variable de error
		var mensajeError = 'Ocurrio un error al guardar intentelo nuevamente';

		// titulo en variable global
		$rootScope.titulo = 'Registro de Paciente';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		// inicializacion de variables
		vm.clientes = datos.clientes;

		vm.paso1 = 'registroPaso1.html';
		vm.paso2 = 'registroPaso2.html';
		vm.paso3 = 'registroPaso3.html';
		vm.paso4 = 'registroPaso4.html';

		// se definen las funciones
		vm.inicio = inicio; //funcion para limpiar todos los campos

		vm.agregaTelefono 	   = agregaTelefono; //funcion que graga mas telefonos disponibles
		vm.buscaAjustador      = buscaAjustador; // funcion que filtra la busqueda de ajustadores
		vm.confirmaProducto    = confirmaProducto; //funcion para seleccionar el producto segun el cliente
		vm.guardaPaciente 	   = guardaPaciente; // funcion para guardar en base de datos los datos del paciente
		vm.guardaSiniestro 	   = guardaSiniestro; // funcion para guardar en base de datos los datos del Siniestro
		vm.verificaProducto    = verificaProducto; // funcion que consulta los productos disponibles segun el usuario
		vm.detalleAjustador    = detalleAjustador; // si elijen a alguien de la lista de ajustadores rellena campos
		vm.resetForms		   		 = resetForms;
		vm.consultaInfo		   	 = consultaInfo;
		vm.verificaObligatorio = verificaObligatorio;
		vm.verificaVigencia    = verificaVigencia;
		vm.preRegistro    		 = preRegistro;

		// funciones del controlador
		function agregaTelefono(ev){
			$mdDialog.show({
				controller: 'telefonoCtrl',
				controllerAs: 'tel',
				templateUrl: 'agregaTelefono.html',
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
				if ($rootScope.modoGuiado) ayuda.registro1('Ayuda para llenar formato de registro');

				// busqueda QualitasWS
				console.log(vm.datos.cliente);
				if ( vm.datos.cliente == 19 ) {
					busqueda.listadoQWS().success(function(data){
						// console.log(data);
						if ( data.length > 0 ) {
							// console.log( data );
							preRegistro( data )
						} else{
							console.log('sin datos');
						}
					})
				}
			}
		}

		function preRegistro( datos ){
			// console.log(datos);
			$mdDialog.show({
				controller: 'preregistroCtrl',
				controllerAs: 'prereg',
				templateUrl: 'preRegistro.html',
				parent: angular.element(document.body),
				locals:{listado: datos},
				clickOutsideToClose:false,
	      escapeToClose: false,
				fullscreen: true
		    })
		}

		$rootScope.prellenaDatos = function( datos ){
			// console.log(datos);
			vm.datoSiniestro.poliza			= datos.QWS_poliza;
			vm.datoSiniestro.folioElec	= datos.QWS_folioElectronico;
			vm.datoSiniestro.siniestro	= datos.QWS_siniestro;
			vm.datoSiniestro.reporte		= datos.QWS_reporte;
			console.log(vm.datoSiniestro);
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

			// console.log(ajustador);

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

				console.log(vm.datos.fechaNac);
				var d = new Date( vm.datos.fechaNac );
				var dia = d.getDate();
				var mes = d.getMonth() +1;
				var anio = d.getFullYear();

				if (dia < 10) {dia = '0'+dia;}
				if (mes < 10) {mes = '0'+mes;}

				vm.datos.fechaNacReg = anio+'-'+mes+'-'+dia;

				console.log(vm.datos.fechaNacReg);

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

					if ($rootScope.modoGuiado) ayuda.registro1('Ayuda para guardar datos de siniestro');

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
			vm.vigencia = 0;

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
				fechaNac:new Date(vm.fecha),
				fechaNacReg:''
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
				fechaExp:'',
				extemporaneo:false,
				motivoEx:''
			}

			consultaInfo();

			if ($rootScope.modoGuiado) ayuda.registro1('Ayuda para seleccionar el cliente');

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
				vm.vigencia = cliente.Cia_vigenciaPase;

				// en caso de haber solo un producto seleccion de producto automatico
				if (vm.productos.length == 1) {
					var producto = vm.productos[0];
					confirmaProducto(producto);
				}else{
					if ($rootScope.modoGuiado) ayuda.registro1('Ayuda para selección de producto');
				}
			});
		}

		function verificaVigencia(){

			var fecha1 = moment();
			var fecha2 = moment(vm.datoSiniestro.fechaExp);

			var dias = fecha1.diff(fecha2, 'days');

			console.log(dias);
			console.log(vm.vigencia);

			if (dias > vm.vigencia) {
				mensajes.alerta('El pase esta vencido','error','top right','report_problem');
			};


		}
	};

	function preregistroCtrl($rootScope, $scope, $mdDialog, listado){
		$scope.listado = listado;
		// console.log($scope.listado);
		$scope.seleccion = 0;

		$scope.datosPre = function( id ){
			// console.log( id );

			for (var i = 0; i < listado.length; i++) {
				if ( listado[i].QWS_id == id ) {
					$scope.datosLesionado = listado[i];
					break;
				}
			}
		}

		$scope.cerrarDialogo = function(){
			$mdDialog.hide();
		}

		$scope.confirmaDatos = function(){
			$rootScope.prellenaDatos( $scope.datosLesionado );
			$mdDialog.hide();
		}

	}

	function telefonoCtrl($mdDialog,tipos,telefonos, mensajes){

		var tel = this;
		tel.tipos = tipos;
		tel.telefonos = telefonos;

		inicio();

		//funciones

		tel.inicio = inicio;
		tel.agregaTelefono = agregaTelefono;
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


		function ingresa() {

			if (tel.telefono == '') {
				$mdDialog.hide(tel.telefonos);
			}else{
				if(confirm('No has agregado el numero que acabas de escribir ¿deseas salir?')){
					$mdDialog.hide(tel.telefonos);
				}
			}
		};

	}

})();
