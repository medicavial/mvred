<?php

class AuthController extends BaseController {

	public function login()
	{

		$user = User::where( array( 'Usu_login' => Input::get('usuario'), 'Usu_activo' => 'S' ) )->first();

		if(isset($user)) {

		    if($user->Usu_pwd == md5(Input::get('psw'))) { // If their password is still MD5

		        Auth::login($user);

		        return $user;

		    }else{

		    	return Response::json(array('flash' => 'Nombre de Usuario o contraseña incorrecta'), 500); 
		    }

		}else{
			return Response::json(array('flash' => 'Nombre de Usuario invalido'), 500); 
		}

	}


	public function Logout(){

		Auth::logout();
		return Response::json(array('flash' => 'Sesion cerrada exitosamente'));
		
	}

	public function inicio($usuario){
		
	}

}
