<?php 

class Ticket extends Eloquent {

    protected $table = 'TicketSeguimiento';
    protected $primaryKey ='TSeg_clave';

    public $timestamps = false;
    
}
