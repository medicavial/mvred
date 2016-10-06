<?php 

class Imagenes extends Eloquent {

    protected $table = 'DocumentosDigitales';
    protected $guarded = []; 
    public $timestamps = false;

    public function scopeImagen($query,$folio,$tipo,$consecutivo)
    {
        return $query->join('TipoDocumento','TipoDocumento.TID_claveint','=','DocumentosDigitales.Arc_tipo')
        			 ->select( DB::raw(
        			 		'TID_claveint as tipo, TID_nombre as tipoNombre ,Arc_archivo as archivo,REG_folio as folio,
        			 		 CASE 
                                WHEN Arc_estatus = 2 THEN "Rechazado"
                                WHEN Arc_estatus = 1 THEN "Autorizado" 
                                ELSE "En espera de Autorización" END as estatus, 
        			 		 CASE 
                                WHEN Arc_estatus = 2 THEN "indeterminate_check_box"
                                WHEN Arc_estatus = 1 THEN "check_box" 
                                ELSE "check_box_outline_blank" END as  iconEstatus, 
                            Arc_clave as clave,
                            Arc_motivo as motivo'
        			 	 ) )
        			 ->where('REG_folio',$folio)
        			 ->where('TID_claveint',$tipo)
        			 ->where('Arc_cons',$consecutivo)
        			 ->first();
    }

    public function scopeDisponibles($query,$atencion)
    {
        return $query->join('TipoDocumento','TipoDocumento.TID_claveint','=','DocumentosDigitales.Arc_tipo')
        			 ->select( DB::raw(
        			 		'TID_claveint as tipo, TID_nombre as tipoNombre ,Arc_archivo as archivo,REG_folio as folio,
        			 		 CASE 
                                WHEN Arc_estatus = 2 THEN "Rechazado"
                                WHEN Arc_estatus = 1 THEN "Autorizado" 
                                ELSE "En espera de Autorización" END as estatus, 
                             CASE 
                                WHEN Arc_estatus = 2 THEN "indeterminate_check_box"
                                WHEN Arc_estatus = 1 THEN "check_box" 
                                ELSE "check_box_outline_blank" END as  iconEstatus, 
                            Arc_clave as clave,
                            Arc_motivo as motivo'
        			 	 ) )
        			 ->where('ATN_clave',$atencion)
        			 ->orderBy('TID_orden')
        			 ->orderBy('Arc_cons')
        			 ->get();
    }
    
}		
