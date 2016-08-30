<?php 

class Autorizacion extends Eloquent {

    protected $table = 'AutorizacionMedica';
    protected $primaryKey ='AUM_clave';
    protected $guarded = []; 
    public $timestamps = false;
    
}		
