<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/


include(app_path() . '/classes/Historico.php');
include(app_path() . '/classes/Accion.php');


Route::get('/', function () { 
    return View::make('hello'); 
});


Route::group(array('prefix' => 'api'), function()
{

    Route::get('/info', function()
    {
        phpinfo();
    });

	Route::get('/', function()
	{
		// return View::make('hello');
        // $pdf = PDF2::loadView('registro.caratula');
        // return $pdf->stream();

        // PDF::SetTitle('Hello World');
        // PDF::AddPage();
        // PDF::Write(0, 'Hello World');
        // PDF::Output(public_path() . 'hello_world.pdf','FD');

        // return Expediente::where('Exp_folio' ,'PRMV000121')->select('*')->first()
        // return Imagenes::where(array('ATN_clave'=> 8,'Arc_tipo'=>29))->first();
        $fechaRegistro = '2016-12-01 00:00:00';

        if(date($fechaRegistro) >= date('2016-11-01 00:00:00')){
            return 'Fecha es mayor o igual';
        }else{
            return 'Fecha es menor';
        }

    });


    Route::post('login', array('uses' => 'AuthController@login'));
    Route::get('logout', array('uses' => 'AuthController@logout'));

    Route::group(array('prefix' => 'busqueda'), function(){

        Route::get('ajustadores/{localidad}', array('uses' => 'BusquedasController@ajustadores'));
        Route::get('atenciones/{folio}', array('uses' => 'BusquedasController@atenciones'));
        Route::get('autorizaciones/{folio}', array('uses' => 'BusquedasController@autorizaciones'));
        Route::get('clientes', array('uses' => 'BusquedasController@clientes'));
        Route::get('detalleAtencion/{clave}', array('uses' => 'BusquedasController@detalleAtencion'));
        Route::get('detalleFolio/{folio}', array('uses' => 'BusquedasController@detalleFolio'));
        Route::get('documentos', array('uses' => 'BusquedasController@documentosRegistrados'));
        Route::get('documentos/{atencion}/{producto}', array('uses' => 'BusquedasController@documentos'));
        Route::get('documentoSolicitud', array('uses' => 'BusquedasController@documentoSolicitud'));
        Route::get('historial/{folio}', array('uses' => 'BusquedasController@historial'));
        Route::get('imagenes/{folio}', array('uses' => 'BusquedasController@imagenes'));
        Route::get('lesionCodificada/{lesion}', array('uses' => 'BusquedasController@lesionCodificada'));
        Route::get('lesionMV/{tipoLES}', array('uses' => 'BusquedasController@lesionMV'));
        Route::get('productoAtencionDocumentos', array('uses' => 'BusquedasController@productoAtencionDocumentos'));
        Route::get('productos', array('uses' => 'BusquedasController@productos'));
        Route::get('productos/{cliente}/{localidad}/{unidad}', array('uses' => 'BusquedasController@productosCliente'));
        Route::get('riesgos', array('uses' => 'BusquedasController@riesgos'));
        Route::get('registros', array('uses' => 'BusquedasController@registros'));
        Route::get('registrosGlobales', array('uses' => 'BusquedasController@registrosGlobales'));
        Route::get('solicitudes/{folio}', array('uses' => 'BusquedasController@solicitudes'));
        Route::get('tickets/{folio}', array('uses' => 'BusquedasController@tickets'));
        Route::get('tiposAtencion', array('uses' => 'BusquedasController@tiposAtencion'));
        Route::get('tiposCancelacion', array('uses' => 'BusquedasController@tiposCancelacion'));
        Route::get('tiposDocumento', array('uses' => 'BusquedasController@tiposDocumento'));
        Route::get('tipoLesion', array('uses' => 'BusquedasController@tipoLesion'));
        Route::get('tiposTelefono', array('uses' => 'BusquedasController@tiposTelefono'));
        Route::get('unidades', array('uses' => 'BusquedasController@unidades'));
    });

    Route::group(array('prefix' => 'operacion'), function(){
        Route::post('autorizaImagen/{atencion}', array('uses' => 'OperacionController@autorizaImagen'));
        Route::post('autorizacion', array('uses' => 'OperacionController@solicitaAutorizacion'));
        Route::get('cambiarEstatus/{clave}/{estatus}/{usuario}', array('uses' => 'OperacionController@cambiarEstatus'));
        Route::get('descargaArchivo', array('uses' => 'OperacionController@descargaArchivo'));
        Route::post('cancelacion', array('uses' => 'OperacionController@solicitaCancelacion'));
        Route::post('creaAtencion', array('uses' => 'OperacionController@creaAtencion'));
        Route::post('documentos', array('uses' => 'OperacionController@documentos'));
        Route::post('eliminaArchivo', array('uses' => 'OperacionController@eliminaArchivo'));
        Route::post('factura', array('uses' => 'OperacionController@factura'));
        Route::post('guardaNotas', array('uses' => 'OperacionController@guardaNotas'));
        Route::post('imagenes', array('uses' => 'OperacionController@imagenes'));
        Route::get('muestraXML/{atencion}', array('uses' => 'OperacionController@muestraXML'));
        Route::get('portada/{folio}', array('uses' => 'OperacionController@generaPortada'));
        Route::post('registraFolio', array('uses' => 'OperacionController@registraFolio'));
        Route::post('registraSiniestro', array('uses' => 'OperacionController@registraSiniestro'));
        Route::post('solicitud', array('uses' => 'OperacionController@solicitud'));
        Route::post('verificaDuplicado', array('uses' => 'OperacionController@verificaDuplicado'));
    });

    Route::group(array('prefix' => 'reportes'), function(){
        Route::get('atenciones/{unidad}', array('uses' => 'ReportesController@atencionesUnidad'));
        Route::get('atenciones/anio/{unidad}', array('uses' => 'ReportesController@atencionesUnidadAnio'));
        Route::get('atenciones/mes/{unidad}', array('uses' => 'ReportesController@atencionesUnidadMes'));
        Route::get('estadistica', array('uses' => 'ReportesController@estadisticaUnidad'));
        Route::get('listado', array('uses' => 'ReportesController@listado'));
        Route::get('notificacionUnidad/{unidad}', array('uses' => 'ReportesController@notificacionUnidad'));
        
    });


});
