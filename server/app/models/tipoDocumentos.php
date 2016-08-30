<?php 

class tipoDocumentos extends Eloquent {

    protected $table = 'TipoDocumento';
    protected $primaryKey ='TID_claveint';
    protected $guarded = []; 
    public $timestamps = false;
    
}		
