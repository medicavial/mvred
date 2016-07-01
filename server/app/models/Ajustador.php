<?php 

class Ajustador extends Eloquent {

    protected $table = 'Cat_Ajustador';
    protected $primaryKey ='AJU_claveint';

    protected $guarded = []; 
    public $timestamps = false;

    public function scopeActivos($query,$localidad)
    {
        return $query->where( array(
                        'AJU_activo'   => 1,
                        'LOC_claveint' => $localidad
                     ))
                     ->orderBy('AJU_nombre')
                     ->get();
    }
    
}		
