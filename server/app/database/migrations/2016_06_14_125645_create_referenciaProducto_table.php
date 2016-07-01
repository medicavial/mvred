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

			$table->string('REF_condicion');
			$table->string('REF_clave');

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
