<?php 

class Compania extends Eloquent {

    protected $table = 'Compania';
    protected $primaryKey ='Cia_clave';

    protected $guarded = []; 
    public $timestamps = false;

    public function scopeActivos($query)
    {
        return $query->where('Cia_activa','S')
        			 ->where('Cia_red',1)
                     ->get();
    }
    
}		
