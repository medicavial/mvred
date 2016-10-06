<?php 

class Requisito extends Eloquent {

    protected $table = 'Requisitos';
    protected $primaryKey ='REQ_clave';

    protected $guarded = []; 
    public $timestamps = false;
    
}		
