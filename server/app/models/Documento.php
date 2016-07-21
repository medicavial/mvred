<?php 

class Documento extends Eloquent {

    protected $table = 'TipoDocumento';
    protected $primaryKey ='TID_claveint';

    protected $guarded = []; 
    public $timestamps = false;

    public function scopeActivos($query)
    {
        return $query->where('TID_activa',1)        		
                     ->orderBy('TID_nombre')
                     ->get();
    }
    
}		
