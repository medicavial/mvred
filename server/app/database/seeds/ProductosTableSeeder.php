<?php

class ProductosTableSeeder extends Seeder {

    public function run()
    {
        DB::table('referenciaProducto')->truncate();
        
    	referenciaProducto::create(array(
            'Cia_clave'     => 7 ,
            'REF_condicion' => 'igual',
            'REF_clave'     => '18',
            'Pro_clave'     => 12
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 7 ,
            'REF_condicion' => 'menos',
            'REF_clave'     => '18',
            'Pro_clave'     => 1
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 7 ,
            'REF_condicion' => 'igual',
            'REF_clave'     => '61',
            'Pro_clave'     => 2
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 7 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => '',
            'Pro_clave'     => 3
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 8 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => '',
            'Pro_clave'     => 1
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 8 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => '',
            'Pro_clave'     => 2
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 8 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => '',
            'Pro_clave'     => 3
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 6 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => '',
            'Pro_clave'     => 1
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 6 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => '',
            'Pro_clave'     => 2
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 3 ,
            'REF_condicion' => 'igual',
            'REF_clave'     => '18,29,81',
            'Pro_clave'     => 9
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 3 ,
            'REF_condicion' => 'menos',
            'REF_clave'     => '18,29,81',
            'Pro_clave'     => 1
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 20 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => 'todas',
            'Pro_clave'     => 1
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 20 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => 'todas',
            'Pro_clave'     => 2
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 19 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => 'todas',
            'Pro_clave'     => 1
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 19 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => 'todas',
            'Pro_clave'     => 5
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 4 ,
            'REF_condicion' => 'igual',
            'REF_clave'     => '18,29',
            'Pro_clave'     => 12
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 4 ,
            'REF_condicion' => 'menos',
            'REF_clave'     => '18,29',
            'Pro_clave'     => 1
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 9 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => 'todas',
            'Pro_clave'     => 1
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 9 ,
            'REF_condicion' => 'igual',
            'REF_clave'     => '41',
            'Pro_clave'     => 6
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 9 ,
            'REF_condicion' => 'igual',
            'REF_clave'     => '41',
            'Pro_clave'     => 7
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 9 ,
            'REF_condicion' => 'igual',
            'REF_clave'     => '41',
            'Pro_clave'     => 4
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 45 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => '',
            'Pro_clave'     => 1
        ));
        
        referenciaProducto::create(array(
            'Cia_clave'     => 45 ,
            'REF_condicion' => 'todo',
            'REF_clave'     => '',
            'Pro_clave'     => 4
        ));



    }

}