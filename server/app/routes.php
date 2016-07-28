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


Route::group(array('prefix' => 'api'), function()
{

	Route::get('/', function()
	{
		// return View::make('hello');
        $pdf = PDF2::loadView('registro.caratula');
        return $pdf->stream();

        // PDF::SetTitle('Hello World');
        // PDF::AddPage();
        // PDF::Write(0, 'Hello World');
        // PDF::Output(public_path() . 'hello_world.pdf','FD');

    });


    Route::post('login', array('uses' => 'AuthController@login'));
    Route::get('logout', array('uses' => 'AuthController@logout'));

    Route::group(array('prefix' => 'busqueda'), function(){

        Route::get('ajustadores/{localidad}', array('uses' => 'BusquedasController@ajustadores'));
        Route::get('clientes', array('uses' => 'BusquedasController@clientes'));
        Route::get('detalleFolio/{folio}', array('uses' => 'BusquedasController@detalleFolio'));
        Route::get('tickets/{folio}', array('uses' => 'BusquedasController@tickets'));
        Route::get('productos', array('uses' => 'BusquedasController@productos'));
        Route::get('productos/{cliente}/{localidad}', array('uses' => 'BusquedasController@productosCliente'));
        Route::get('tipos', array('uses' => 'BusquedasController@tipos'));
        Route::get('riesgos', array('uses' => 'BusquedasController@riesgos'));
        Route::get('registros', array('uses' => 'BusquedasController@registros'));
        Route::get('registrosGlobales', array('uses' => 'BusquedasController@registrosGlobales'));
        Route::get('documentos', array('uses' => 'BusquedasController@documentos'));

    });

    Route::group(array('prefix' => 'operacion'), function(){
        Route::post('registraFolio', array('uses' => 'OperacionController@registraFolio'));
        Route::post('registraSiniestro', array('uses' => 'OperacionController@registraSiniestro'));
        Route::post('verificaDuplicado', array('uses' => 'OperacionController@verificaDuplicado'));
    });

    Route::group(array('prefix' => 'reportes'), function(){
        Route::get('atenciones/anio/{unidad}', array('uses' => 'ReportesController@atencionesUnidadAnio'));
        Route::get('atenciones/mes/{unidad}', array('uses' => 'ReportesController@atencionesUnidadMes'));
    });


});
