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
		return View::make('hello');
        // getBarcodePNGPath

        // echo DNS1D::getBarcodeHTML("ROMV000005", "C39",1,40);

        // DNS2D::getBarcodePNGPath("ARBO000898", "C39",0.9,40);

        // $archivo =  'ARBO000898.png';
        // $destino = 'codigos/ARBO000898.png';

        // File::move($archivo, $destino);
    });


    Route::post('login', array('uses' => 'AuthController@login'));
    Route::get('logout', array('uses' => 'AuthController@logout'));

    Route::group(array('prefix' => 'busqueda'), function(){

        Route::get('ajustadores/{localidad}', array('uses' => 'BusquedasController@ajustadores'));
        Route::get('clientes', array('uses' => 'BusquedasController@clientes'));
        Route::get('productos', array('uses' => 'BusquedasController@productos'));
        Route::get('productos/{cliente}/{localidad}', array('uses' => 'BusquedasController@productosCliente'));
        Route::get('tipos', array('uses' => 'BusquedasController@tipos'));
        Route::get('riesgos', array('uses' => 'BusquedasController@riesgos'));
        Route::get('registros', array('uses' => 'BusquedasController@registros'));

    });

    Route::group(array('prefix' => 'operacion'), function(){
        Route::post('registraFolio', array('uses' => 'OperacionController@registraFolio'));
        Route::post('registraSiniestro', array('uses' => 'OperacionController@registraSiniestro'));
        Route::post('verificaDuplicado', array('uses' => 'OperacionController@verificaDuplicado'));
    });
});
