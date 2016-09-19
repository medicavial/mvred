<?php 

class TipoAtencion extends Eloquent {

    protected $table = 'TipoAtencion';
    protected $primaryKey ='TIA_clave';

    protected $guarded = []; 
    public $timestamps = false;

    public function scopeActivos($query)
    {
        return $query->where('TIA_activa', 1)
                     ->get();
    }
    
}		
