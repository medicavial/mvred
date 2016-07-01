<?php 

class TipoTelefono extends Eloquent {

    protected $table = 'TipoTelefono';
    protected $primaryKey ='TT_clave';

    protected $guarded = []; 
    public $timestamps = false;
    
}		
