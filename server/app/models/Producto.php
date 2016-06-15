<?php 

class Producto extends Eloquent {

    protected $table = 'Producto';
    protected $primaryKey ='Pro_clave';

    protected $guarded = []; 
    public $timestamps = false;

    public function scopeActivos($query)
    {
        return $query->where('Pro_activo','S')
                     ->get();
    }
    
}		
