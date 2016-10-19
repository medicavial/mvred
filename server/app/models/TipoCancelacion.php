<?php 

class TipoCancelacion extends Eloquent {

    protected $table = 'CatCancelacion';
    protected $primaryKey ='CAC_cve';
    protected $guarded = []; 
    public $timestamps = false;
    
}		
