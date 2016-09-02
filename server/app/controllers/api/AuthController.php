<?php

class AuthController extends BaseController {

	public function login()
	{

		$login = Input::get('usuario');
		$psw = Input::get('psw');


		$user = User::where( array( 'Usu_login' => $login, 'Usu_activo' => 'S' ) )->first();

		if(isset($user)) {

		    if($user->Usu_pwd == md5($psw)) { //si el password es el mismo

		        Auth::login($user);

		        $usuario = User::join('Unidad','Unidad.Uni_clave','=','Usuario.Uni_clave')
		        			   ->join('Permiso','Permiso.Usu_login','=','Usuario.Usu_login')
		        			   ->select('Permiso.*','LOC_claveint','Unidad.Uni_clave','Usu_nombre','Uni_nombrecorto','Uni_propia')
		        			   ->where('Usuario.Usu_login',$login)
		        			   ->first();

		        if ($usuario->Uni_propia == 'S') {
		        	return Response::json(array('flash' => 'Nombre de Usuario invalido'), 500); 
		        }else{
		        	return $usuario;
		        }

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
