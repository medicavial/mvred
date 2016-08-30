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
Route::get('/', function()
{
	return View::make('hello');
});

Route::get('/info', function()
{
    phpinfo();
});


Route::group(array('prefix' => 'api'), function()
{

	Route::get('/', function()
	{
		// return View::make('hello');
        // $pdf = PDF2::loadView('registro.caratula');
        // return $pdf->stream();

        // PDF::SetTitle('Hello World');
        // PDF::AddPage();
        // PDF::Write(0, 'Hello World');
        // PDF::Output(public_path() . 'hello_world.pdf','FD');

        return Imagenes::where('REG_folio','PRMV000116')->max('Arc_cons') + 1;



    });


    Route::post('login', array('uses' => 'AuthController@login'));
    Route::get('logout', array('uses' => 'AuthController@logout'));

    Route::group(array('prefix' => 'busqueda'), function(){

        Route::get('ajustadores/{localidad}', array('uses' => 'BusquedasController@ajustadores'));
        Route::get('autorizaciones/{folio}', array('uses' => 'BusquedasController@autorizaciones'));
        Route::get('clientes', array('uses' => 'BusquedasController@clientes'));
        Route::get('detalleFolio/{folio}', array('uses' => 'BusquedasController@detalleFolio'));
        Route::get('documentos', array('uses' => 'BusquedasController@documentos'));
        Route::get('historial/{folio}', array('uses' => 'BusquedasController@historial'));
        Route::get('imagenes/{folio}', array('uses' => 'BusquedasController@imagenes'));
        Route::get('tickets/{folio}', array('uses' => 'BusquedasController@tickets'));
        Route::get('productos', array('uses' => 'BusquedasController@productos'));
        Route::get('productos/{cliente}/{localidad}', array('uses' => 'BusquedasController@productosCliente'));
        Route::get('riesgos', array('uses' => 'BusquedasController@riesgos'));
        Route::get('registros', array('uses' => 'BusquedasController@registros'));
        Route::get('registrosGlobales', array('uses' => 'BusquedasController@registrosGlobales'));
        Route::get('tiposDocumento', array('uses' => 'BusquedasController@tiposDocumento'));
        Route::get('tipos', array('uses' => 'BusquedasController@tipos'));

    });

    Route::group(array('prefix' => 'operacion'), function(){
        Route::post('imagenes', array('uses' => 'OperacionController@imagenes'));
        Route::post('eliminaImagen', array('uses' => 'OperacionController@eliminaImagen'));
        Route::post('registraFolio', array('uses' => 'OperacionController@registraFolio'));
        Route::post('registraSiniestro', array('uses' => 'OperacionController@registraSiniestro'));
        Route::post('verificaDuplicado', array('uses' => 'OperacionController@verificaDuplicado'));
    });

    Route::group(array('prefix' => 'reportes'), function(){
        Route::get('atenciones/anio/{unidad}', array('uses' => 'ReportesController@atencionesUnidadAnio'));
        Route::get('atenciones/mes/{unidad}', array('uses' => 'ReportesController@atencionesUnidadMes'));
    });


});
