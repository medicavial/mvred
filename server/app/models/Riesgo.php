<?php 

class Riesgo extends Eloquent {

    protected $table = 'RiesgoAfectado';
    protected $primaryKey ='RIE_clave';

    protected $guarded = []; 
    public $timestamps = false;

    public function scopeActivos($query)
    {
        return $query->where('RIE_activo','S')
                     ->orderBy('RIE_nombre')
                     ->get();
    }
    
}		
