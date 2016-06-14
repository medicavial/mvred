<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class User extends Eloquent implements UserInterface, RemindableInterface {

	use UserTrait, RemindableTrait;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'Usuario';
	protected $primaryKey ='Usu_login';
	protected $guarded = []; 

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

	protected $hidden = array('Usu_pwd');

	//cuando no es una columna llamada password se tiene que especificar cual es para el logueo
	public function getAuthPassword() {
	    return $this->Usu_pwd;
	}

}
