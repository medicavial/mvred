<?php 

class Atencion extends Eloquent {

    protected $table = 'Atenciones';
    protected $primaryKey ='ATN_clave';

    protected $guarded = []; 
    public $timestamps = false;
    
}		
