<?php

class Accion {

	static function generaPortada($folio){

		//obtenemos datos del expediente
		$expediente = Expediente::find($folio);

		$nombre				= $expediente->Exp_nombre;
		$paterno			= $expediente->Exp_paterno;
		$materno			= $expediente->Exp_materno;
		$siniestro			= $expediente->Exp_siniestro;
		$poliza				= $expediente->Exp_poliza;
		$reporte			= $expediente->Exp_reporte;
		$obs				= $expediente->Exp_obs;
		$folio				= $expediente->Exp_folio;
		$unidad				= $expediente->Uni_clave;
		$fechahora			= $expediente->Exp_fecreg;
		$usuario			= $expediente->Usu_registro;
        $riesgoC			= $expediente->RIE_clave;
        $CiaClave			= $expediente->Cia_clave;
        $RegCia				= $expediente->Exp_RegCompania;
        $producto			= $expediente->Pro_clave;
        $escolaridad		= $expediente->Esc_clave;
        $recibo				= $expediente->cia_recibo;
        $orden				= $expediente->Exp_orden;
        $bitacora			= $expediente->Exp_bitacora;
        $modificador		= $expediente->Exp_modificador;
        $uniActual			= $expediente->Uni_ClaveActual;


		$riesgoNombre = Riesgo::find($riesgoC)->RIE_nombre;
		$unidaNombre = Unidad::find($unidad)->Uni_nombre;
		$unidaActNombre = Unidad::find($uniActual)->Uni_nombre;
		$escNombre =  ($escolaridad  == 0) ? '' : Escolaridad::find($escolaridad)->Esc_nombre;

		$logo = Compania::find($CiaClave)->Cia_logo;
		$compania = Compania::find($CiaClave)->Cia_nombrecorto;

		$productoImagen = Producto::find($producto)->Pro_img;

        $cadena = $compania.$nombre.$paterno.$materno.$siniestro.$poliza.$reporte.$obs.$folio.$unidad.$fechahora.$usuario.'MV';
		$cadena = md5($cadena);

		$imagen = public_path() . "/logos/" . $logo; 
		$tipo = "JPG"; 
		$sise = 40;

		$imgProd = public_path() . "/producto/" . $productoImagen;

		if($CiaClave==19){
			$CampoCompania ="<b>Folio electrónico: </b>".$RegCia;
		}else if($CiaClave==10){
		 	$CampoCompania="<b>Folio segme.: </b>".$RegCia;
		}else{
		 	$CampoCompania="";
		}

		$pdf = new PDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

		$pdf::SetPrintHeader(false);
		$pdf::SetPrintFooter(true);
		$pdf::SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
		//set margins
		$pdf::SetMargins(PDF_MARGIN_LEFT, 10, PDF_MARGIN_RIGHT);
		$pdf::SetHeaderMargin(PDF_MARGIN_HEADER);
		$pdf::SetFooterMargin(PDF_MARGIN_FOOTER);
		// set header and footer fonts
		$pdf::setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
		$pdf::setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
		//set auto page breaks
		$pdf::SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
		//set image scale factor
		$pdf::setImageScale(PDF_IMAGE_SCALE_RATIO);
		// set default font subsetting mode
		$pdf::setFontSubsetting(true);
		// Set font
		// dejavusans is a UTF-8 Unicode font, if you only need to
		// print standard ASCII chars, you can use core fonts like
		// helvetica or times to reduce file size.
		$pdf::SetFont('dejavusans', '', 8, '', true);

		$pdf::AddPage();
		//////////////
		////////////////////////////////////////////////////////////////
		///// código de barras creado en el pdf
		$style = array(
                'position' => '',
                'align' => 'C',
                'stretch' => false,
                'fitwidth' => true,
                'cellfitalign' => '',
                'border' => TRUE,
                'hpadding' => 'auto',
                'vpadding' => 'auto',
                'fgcolor' => array(0,0,0),
                'bgcolor' => false, //array(255,255,255),
                'text' => true,
                'font' => 'helvetica',
                'fontsize' => 8,
                'stretchtext' => 4
   		);

		$pdf::write1DBarcode($folio, 'C39', 95, 18, 49,15, 0.4, $style, 'C');
		// $image_file = $imagen;
		$pdf::Image($imagen, 15, 18, $sise, '', $tipo, '', 'T', false, 300, '', false, false, 0, false, false, false);
		// $image_file = $imgProd;
		$pdf::Image($imgProd, 63, 16, 15, '', 'JPG', '', 'T', false, 300, '', false, false, 0, false, false, false);
			
	    $pdf::SetFont('helvetica', 'B', 10); 
	    $pdf::Cell(30, 14,$modificador, 0, 40, 'L',false,'', 0,false, 'T', 'B');   
		$pdf::SetFont('helvetica', 'B', 8);
		$pdf::Cell(0, 50,"Fecha:".date('d'.'/'.'m'.'/'.'Y')." "."Hora:".date('g'.':'.'i'.' '.'A'), 0, false, 'R', 0, '', 0, false, 'M', 'M');
		$pdf::Ln(25);


		$html = "
				<table border=\"1\" cellspacing=\"2\" cellpadding=\"2\">
				   <tr>
				        <td colspan=\"2\">
				            <b>Folio: </b>".$folio."
				        </td>
				        <td colspan=\"2\">
				            <b>Compañia: </b>".$compania."
				        </td>
				        <td colspan=\"2\">
				           <b>Unidad Médica: </b>".$unidaNombre."
				        </td>
				   </tr>
				   <tr>
				       <td colspan=\"2\">
				          <b>Póliza: </b>".$poliza."
				       </td>
				       <td colspan=\"2\">
				         <b>Siniestro: </b>".$siniestro."
				       </td>
				       <td colspan=\"2\">
				         <b>Unidad Actual: </b>".$unidaActNombre."
				       </td>
				   </tr>
				   <tr>
				   <td colspan=\"2\">
				          <b>Riesgo: </b>".$riesgoNombre."
				       </td>
				       <td colspan=\"2\">
				       <b>Reporte: </b>".  $reporte."
				       </td>
				       <td colspan=\"2\">
				         
				       </td>

				   </tr>
				   <tr>
				   <td colspan=\"2\">
				          <b>No. de orden: </b>".$orden."
				       </td>
				       <td colspan=\"2\">
				        <b>".$bitacora."</b>
				       </td>
				       <td colspan=\"2\">
				          ".$CampoCompania."
				       </td>

				   </tr>
				   <tr>
				       <td colspan=\"6\">
				           <b>Observaciones: </b>".$obs."
				       </td>
				   </tr>
				   <tr>
				       <td colspan=\"6\">
				           <b>Lesionado: </b>".$nombre." ".$paterno." ".$materno."
				       </td>
				   </tr>
				   <tr>
				       <td colspan=\"2\">
				          <b>Usuario: </b>".$usuario."
				       </td>
				       <td colspan=\"2\">
				           <b>Registro: </b>".$fechahora."
				       </td>
				       <td colspan=\"2\">
				       </td>
				   </tr>
				   <tr>
				       <td colspan=\"4\">
				          <b>Verificador: </b>".$cadena."
				       </td>
				       <td colspan=\"2\">
				       </td>
				   </tr>
				</table>
				";
		$pdf::writeHTMLCell($w=0, $h=0, $x='', $y='', $html, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
		$html="";
		$pdf::Ln(10);
		$html="
		     <h3 align=\"center\">Favor de anexar al expediente la siguiente documentación:</h3>
		";
		$pdf::writeHTMLCell($w=0, $h=0, $x='', $y='', $html, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
		$html="";

		$pdf::Ln(5);

		$html="
		    <table border=\"1\" cellspacing=\"2\" cellpadding=\"2\">
				<tr>
					<td width=\"5%\">
						<input type=\"checkbox\" name=\"a\" />
					</td>
					<th align=\"left\" width=\"27%\">
						Pase Medico Original
					</th>
					<td width=\"68%\">
							<ul>
								<li>Que esta dentro de vigencia.</li>
								<li>Que coincida con la identidad del lesionado.</li>
								<li>Que no presente alteraciones.</li>
								<li>En algunos casos se requiere llenar el informe medico impreso al reverso.</li>
							</ul>
					</td>

				</tr>
				<tr>
					<td width=\"5%\">
						<input type=\"checkbox\" name=\"a\"/>
					</td>
					<th align=\"left\" width=\"27%\">
						Nota Medica (formato M&eacutedicavial)
					</th>
					<td width=\"68%\">
							<ul>
								<li>Llena en letra clara.</li>
								<li>Llena en su totalidad.</li>
								<li>Que detalle los suministros otorgados.</li>
								<li>Que detalle los estudios radiologicos.</li>
								<li>Que describa claramente el diagnostico.</li>
								<li>Que este firmada por el lesionado donde sea pertinente.</li>
								<li>Que este firmada por el medico tratante (incluir cedula de especialidad).</li>
								<li>Deseable:incluir numero de CPTs.</li>
							</ul>
					</td>

				</tr>
				<tr>
					<td width=\"5%\">
						<input type=\"checkbox\" name=\"a\" />
					</td>
					<th align=\"left\" width=\"27%\">
						Cuestionario de atencion
					</th>
					<td width=\"68%\">
							<ul>
								<li>Que esto bien identificado (nombre, medico, etc).</li>
								<li>Firmado por el lesionado.</li>
							</ul>
					</td>

				</tr>
				<tr>
					<td width=\"5%\">
						<input type=\"checkbox\" name=\"a\" />
					</td>
					<th align=\"left\" width=\"27%\">
						Copia de identificaci&oacuten
					</th>
					<td width=\"68%\">
							<ul>
								<li>Que pertenezca al lesionado.</li>
								<li>Que sea oficial.</li>
								<li>Fotocopiada por ambos lados.</li>
								<li>En caso necesario se puede utilizar el formato de identificacion. (verificar firmas y huella)</li>
		                                                <li>Verificar parentesco</li>
							</ul>
					</td>

				</tr>
				<tr>
					<td colspan=\"4\">
						**Favor de verificar la consistencia de las firmas en todo el expediente<br>
						**Todos los formatos deberan estar bien identificados<br>
						**Favor de imprimir este formato y anexarlo al expediente<br>
					</td>

				</tr>
			</table>
		";
		$pdf::writeHTMLCell($w=0, $h=0, $x='', $y='', $html, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
		$html="";


		$pdf::Ln(35);

		$html="
			<table border=\"0\"  width=\"1500\">
			     <tr>
			          <td width=\"20%\">

			          </td>
			          <td width=\"60%\">
			          <hr />
			         </td>
			         <td width=\"20%\">

			         </td>
			     </tr>
			     <tr>
			          <td width=\"20%\" align=\"center\">

			          </td>
			          <td width=\"60%\" align=\"center\">
			           Nombre y firma de Recepcionista en turno
			          </td>
			          <td width=\"20%\" align=\"center\">

			          </td>
			     </tr>
			</table>
        ";

		$pdf::writeHTMLCell($w=0, $h=0, $x='42', $y='', $html, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
		$html="";

        $pdf::Output('hello_world.pdf','I');
	}

}

