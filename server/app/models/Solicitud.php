<?php 

class Solicitud extends Eloquent {

    protected $table = 'Solicitudes';
    protected $primaryKey ='SOL_claveint';

    protected $guarded = []; 
    public $timestamps = false;
    
}		
