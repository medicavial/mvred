<?php 

class Unidad extends Eloquent {

    protected $table = 'Unidad';
    protected $primaryKey ='Uni_clave';

    public $timestamps = false;

    
	public function scopeActivosRed($query)
    {
        return $query->where( array(
                        'Uni_propia'   => 'N',
                        'Uni_activa' => 'S'
                     ))
                     ->orderBy('Uni_nombrecorto')
                     ->get();
    }


}


