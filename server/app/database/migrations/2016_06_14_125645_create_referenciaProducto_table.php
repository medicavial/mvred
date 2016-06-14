<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReferenciaProductoTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('referenciaProducto', function(Blueprint $table)
		{
			$table->integer('Cia_clave')->unsigned();
			$table->foreign('Cia_clave')->references('Cia_clave')->on('Compania');

			$table->integer('LOC_claveint')->unsigned();
			$table->foreign('LOC_claveint')->references('LOC_claveint')->on('Localidad');

			$table->integer('Uni_clave')->unsigned();
			$table->foreign('Uni_clave')->references('Uni_clave')->on('Unidad');

			$table->integer('Pro_clave')->unsigned();
			$table->foreign('Pro_clave')->references('Pro_clave')->on('Producto');

		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('referenciaProducto');
	}

}
