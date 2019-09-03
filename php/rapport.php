<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Rapport plan</title>
	<style type="text/css" media="all">
		@import "../css/style.css";
		@import "../css/interrupt.css";
	</style>
</head>

<body>
	<div id="calque_titre_feuille">
		<h1 id="nom_plan">Contrôle du plan de récolement</h1>
	</div>
	
	
	<!--*******************************************************************************
						TEST 1 : CONTROLE DE LA PROJECTION
	********************************************************************************-->
	<p>
		<div class="titres1" id="calque_titre_test1">
			<table border="0" class="table_titreTest">
				<tr>
					<td width="10%" class="numeroTitre td_titreTestBordureDroite">1.</td>
					<td align="center" class="td_titreTestBordureHautBas"><h2>Contrôle de la projection des données</h2></td>
					<td align="center" class="td_titreTestBordureGauche" width="20%">
						<div class="onoffswitch">
							<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="onoffswitch1">
							<label class="onoffswitch-label" for="onoffswitch1">
								<span class="onoffswitch-inner"></span>
								<span class="onoffswitch-switch"></span>
							</label>
						</div>
					</td>
				</tr>
				<tr>
				<td colspan="3"><div class="description" id="descriptionTest1"></div></td>
				</tr>
			</table>
		</div>
		
		<div class="ContenuTest1" id="calque_contenu_test1">
			<table id="contenu_test1" class="table_projection">
				<tr>
					<td align="left"><b>Projection demandée</b></td><td  align="left" colspan=2 id="proj_dem"></td>
				</tr>
				<tr>
					<td align="left"><b>Projection utilisée</b></td><td  align="left" colspan=2 id="proj_util"></td>
				</tr>
				<tr>
					<td align="left"><b>Commentaire sur la projection</b></td><td  align="left" id="proj_com"></td>
															<td align="right" class="tablenone"><input class="bouton_image_modif_contenu" type="submit" id="bton_modif_comm_proj" value=" " title="Modifier ou compléter le commentaire"/></td>
				</tr>
			</table>
		</div>
	</p>
	
	<!--*******************************************************************************
						TEST 2 : STRUCTURE DES CALQUES
	********************************************************************************-->
	<p>
		<div class="titres2" id="calque_titre_test2">
			<table border="0" class="table_titreTest">
				<tr>
					<td width="10%" class="numeroTitre td_titreTestBordureDroite">2.</td>
					<td class="td_titreTestBordureHautBas"><h2>Contrôle de la structure des calques</h2></td>
					<td align="center" class="td_titreTestBordureGauche" width="20%">
						<div class="onoffswitch">
							<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="onoffswitch2">
							<label class="onoffswitch-label" for="onoffswitch2">
								<span class="onoffswitch-inner"></span>
								<span class="onoffswitch-switch"></span>
							</label>
						</div>
					</td>
				</tr>
				<tr>
				<td colspan="3"><div class="description" id="descriptionTest2"></div></td>
				</tr>
			</table>
		</div>
		
		<div class="ContenuTest2" id="calque_contenu_test2">
			<table id="contenu_test2" class="table_projection">
				
			</table>
		</div>
	</p>
	
	<!--*******************************************************************************
						TEST 3 : CONTROLE DES CHAMPS
	********************************************************************************-->
	<p>
		<div class="titres3" id="calque_titre_test3">
			<table border="0" class="table_titreTest">
				<tr>
					<td width="10%" class="numeroTitre td_titreTestBordureDroite">3.</td>
					<td class="td_titreTestBordureHautBas"><h2>Contrôle de remplissage des données métiers</h2></td>
					<td align="center" class="td_titreTestBordureGauche" width="20%">
						<div class="onoffswitch">
							<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="onoffswitch3">
							<label class="onoffswitch-label" for="onoffswitch3">
								<span class="onoffswitch-inner"></span>
								<span class="onoffswitch-switch"></span>
							</label>
						</div>
					</td>
				</tr>
				<tr>
				<td colspan="3"><div class="description" id="descriptionTest3"></div></td>
				</tr>
			</table>
		</div>
		
		<div class="ContenuTest3">
			<table border="0" id="contenu_test3" class="table_projection">
				
			</table>
		</div>
	</p>
	
	<button id="bton_enreg_json">Enregistre les modifications</button>
    <script src="../js/ajax.js"></script>
    <script src="../js/planrecol.js"></script>
</body>

</html>