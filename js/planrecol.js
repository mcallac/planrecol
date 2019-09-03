var TitreFeuille = document.getElementById("calque_titre_feuille");
var contenuDescriptionTest1= document.getElementById("descriptionTest1");
var contenuDescriptionTest2= document.getElementById("descriptionTest2");
var contenuDescriptionTest3= document.getElementById("descriptionTest3");

var contenuProjCommentaire=document.getElementById("proj_com");
var contenuProjAttentue=document.getElementById("proj_dem");
var contenuProjUtilise=document.getElementById("proj_util");
var boutonComProj=document.getElementById("bton_modif_comm_proj");
var boutonEnregJson=document.getElementById("bton_enreg_json");
var switchTest1=document.getElementById("onoffswitch1");
var switchTest2=document.getElementById("onoffswitch2");
var switchTest3=document.getElementById("onoffswitch3");

var tableTest2=document.getElementById("contenu_test2");
var tableTest3=document.getElementById("contenu_test3");

var changeJson=false;

var controles;

var idPlan=getUrlParam('id');
var indexCalqueEltNouveau=1;//Index du calque qui contient les données métiers utilisés pour le test3 (calque Élements nouveaux)

//images
var imgValider = document.createElement('img');
imgValider.src="../img/valider.png";
imgValider.height=25;
imgValider.width=25;
var imgCroix = document.createElement('img');
imgCroix.src="../img/delete.png";
imgCroix.height=25;
imgCroix.width=25;

//Listes déroulantes
var cmboCalqueResult = document.createElement('select');
cmboCalqueResult.setAttribute("id","selectCalqueResultat");
cmboCalqueResult.innerHTML="<option value=\"ok\">succès</option>"+
							"<option value=\"ko_nb\">échec non bloquant</option>"+
							"<option value=\"ko_b\">échec bloquant</option>";
							
var cmboChampResult = document.createElement('select');
cmboChampResult.setAttribute("id","selectChampResultat");
cmboChampResult.innerHTML="<option value=\"ok\">succès</option>"+
							"<option value=\"ko_nb\">échec non bloquant</option>"+
							"<option value=\"ko_b\">échec bloquant</option>";


ajaxGet("http://tome/intranet/testplanrecol/plans/"+idPlan+"/rapport.json", main);


//Fonction Main
function main(reponse) {
	// Transforme la réponse en un tableau d'articles
	controles = JSON.parse(reponse);

	//Les descriptions des tests
	contenuDescriptionTest1.innerHTML=controles.descriptionTestProjection;
	contenuDescriptionTest2.innerHTML=controles.descriptionTestCalque;
	contenuDescriptionTest3.innerHTML=controles.descriptionTestChamps;

	/*--------------------------------------------------------
			TEST 1 : PROJECTION
	--------------------------------------------------------*/
	var titreCtrl = document.createElement("h2");
	titreCtrl.textContent = controles.nom;
	TitreFeuille.appendChild(titreCtrl);

	contenuProjAttentue.innerHTML=controles.Projection[0].projAttendue;
	contenuProjUtilise.innerHTML=controles.Projection[0].projUtilise;
	contenuProjCommentaire.innerHTML=controles.Projection[0].commentaire;

	if (controles.Projection[0].result=="ok"){
		switchTest1.checked=true;
	}else{
		switchTest1.checked=false;
	}
	
	/*--------------------------------------------------------
			TEST 2 : STRUCTURE DES CALQUES
	--------------------------------------------------------*/
	
	var newRow=tableTest2.insertRow();
	var cellTitreGrp=newRow.insertCell(0);
	var cellTitreCalque=newRow.insertCell(1);
	var cellTitrePresent=newRow.insertCell(2);
	var cellTitreNbElets=newRow.insertCell(3);
	var cellTitreCommentaire=newRow.insertCell(4);
	var cellTitreResultat=newRow.insertCell(5);
	cellTitreCommentaire.colSpan=2;
	
	cellTitreGrp.innerHTML="<b>Groupe</b>";
	cellTitreCalque.innerHTML="<b>Calque</b>";
	cellTitrePresent.innerHTML="<b>Présent</b>";
	cellTitreNbElets.innerHTML="<b>Entités</b>";
	cellTitreCommentaire.innerHTML="<b>Commentaire</b>";
	cellTitreResultat.innerHTML="<b>Contrôle</b>";
	
	succesTest2=true;
	
	//On parcourt les groupes dans le json
	for (keyGrp in controles.StructureCalques) {
		var newRow=tableTest2.insertRow();
		var cellGrp=newRow.insertCell(0);
		cellGrp.rowSpan=controles.StructureCalques[keyGrp].calques.length;
		cellGrp.innerHTML=controles.StructureCalques[keyGrp].rubrique;
		/* indexColumnCalque correspond à l'index de la colonne qui doit contenir le nom du calque. Étant donné que la 1ère colonne (Groupe)
		à 1 rowspan = au nombre de calques, l'index de la colonne du calque va don cêtre égale à 1 quand on est sur la 1ère ligne et à 0 sur les autres
		*/
		indexColumnCalque=1
		for (keyCalque in controles.StructureCalques[keyGrp].calques) {
			var CellCalque=newRow.insertCell(indexColumnCalque);
			var CellPresent=newRow.insertCell(indexColumnCalque+1);
			var CellNbElemts=newRow.insertCell(indexColumnCalque+2);
			var CellCommentaire=newRow.insertCell(indexColumnCalque+3);
			var CellModifCommentaire=newRow.insertCell(indexColumnCalque+4);
			var CellModifResultat=newRow.insertCell(indexColumnCalque+5);
			
			CellCalque.innerHTML=controles.StructureCalques[keyGrp].calques[keyCalque].calque;
			CellNbElemts.innerHTML=controles.StructureCalques[keyGrp].calques[keyCalque].nbEltsTot;
			CellNbElemts.style.textAlign = "center";
			CellPresent.style.textAlign = "center";
			if (controles.StructureCalques[keyGrp].calques[keyCalque].present=="oui") {
				CellPresent.appendChild(imgValider.cloneNode(true));
			}else{
				CellPresent.appendChild(imgCroix.cloneNode(true));
			}
			CellCommentaire.innerHTML=controles.StructureCalques[keyGrp].calques[keyCalque].commentaire
			CellCommentaire.id="commcalque_"+controles.StructureCalques[keyGrp].calques[keyCalque].calque;
			CellCommentaire.keyGrp=keyGrp;
			CellCommentaire.keyCalque=keyCalque;
			CellModifCommentaire.innerHTML="<td align=\"right\" class=\"tablenone\">"+
					"<input class=\"bouton_image_modif_contenu\" type=\"submit\" id=\""+controles.StructureCalques[keyGrp].calques[keyCalque].calque+"\" value=\" \""+ 
					"title=\"Modifier ou compléter le commentaire\"/>"+
					"</td>";
			
			//Combo pour afficher le résultat du contrôle du calque id=cmboRes+nomDuCalque pour mettre en relation le calque avec le combo
			cmboNewCalqueResultat=cmboCalqueResult.cloneNode(true);
			cmboNewCalqueResultat.keyGrp=keyGrp
			cmboNewCalqueResultat.keyCalque=keyCalque;
			cmboNewCalqueResultat.value=controles.StructureCalques[keyGrp].calques[keyCalque].result;
			switch(cmboNewCalqueResultat.value) {
				case 'ok':
					cmboNewCalqueResultat.style.backgroundColor="palegreen";
					break;
					
				case 'ko_nb':
					cmboNewCalqueResultat.style.backgroundColor="gold";
					break;
				
				case 'ko_b':
					cmboNewCalqueResultat.style.backgroundColor="orangered";
					break;
				
			}
			cmboNewCalqueResultat.addEventListener("change",ChangeControleResultCalque);//Changer la couleur de fond selon la valeur sélectionnée
			CellModifResultat.appendChild(cmboNewCalqueResultat);
			
			
			if (controles.StructureCalques[keyGrp].calques[keyCalque].result=="ko_b") {
				succesTest2=false; //result = "ok" --> le calque est présent - result = "ko_nb" --> le calque n'est pas présent mais il n'est pas obligatoire  - result = "ko_b" --> le calque n'est pas présent et est  obligatoire, le test est alors non concluant
			}
			
			
			//Événement sur le bouton modif commentaire de la structure du calque
			CellModifCommentaire.addEventListener("click", modifCommentaireStructCalques);
			if (indexColumnCalque==1) {indexColumnCalque=0;} 
			var newRow=tableTest2.insertRow();
		}
	}
	
	if (succesTest2==true){
		switchTest2.checked=true;
	}else{
		switchTest2.checked=false;
	}
	
	/*--------------------------------------------------------
			TEST 3 : CONTROLE DE REMPLISSAGE DES CHAMPS
					 POUR LE CALQUE "ÉLÉMENTS NOUVEAUX
	--------------------------------------------------------*/
	var newRow=tableTest3.insertRow();
	var cellTitreCouche=newRow.insertCell(0);
	var cellTitreAttribut=newRow.insertCell(1);
	var cellTitrePresent=newRow.insertCell(2);
	var cellTitreNbEltsRens=newRow.insertCell(3);
	var cellTitreCommentaire=newRow.insertCell(4);
	var cellTitreResultat=newRow.insertCell(5);
	cellTitreCommentaire.colSpan=2;
	cellTitreNbEltsRens.colSpan=2;
	
	cellTitreCouche.innerHTML="<b>Couche</b>";
	cellTitreAttribut.innerHTML="<b>Attribut</b>";
	cellTitrePresent.innerHTML="<b>Présent</b>";
	cellTitreNbEltsRens.innerHTML="<b>Remplissage</b>";
	cellTitreCommentaire.innerHTML="<b>Commentaire</b>";
	cellTitreResultat.innerHTML="<b>Contrôle</b>";
	
	succesTest3=true;
	
	for (keyCouche in controles.StructureCalques[indexCalqueEltNouveau].calques) {
		
			var newRow=tableTest3.insertRow();
			var CellCouche=newRow.insertCell(0);
			
		if (controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].present=='oui') {
			if (controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs.length>0) {
				CellCouche.innerHTML=controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].calque;
				CellCouche.rowSpan=controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs.length;
				indexColumnChamp=1;
				for (keyChamp in controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs) {
					var CellAttribut=newRow.insertCell(indexColumnChamp);
					var CellPresent=newRow.insertCell(indexColumnChamp+1);
					var CellNbElemtsRens=newRow.insertCell(indexColumnChamp+2);
					var CellTxRemplissage=newRow.insertCell(indexColumnChamp+3);
					var CellCommentaire=newRow.insertCell(indexColumnChamp+4);
					var CellModifCommentaire=newRow.insertCell(indexColumnChamp+5);
					var CellModifResultat=newRow.insertCell(indexColumnChamp+6);
					
					CellAttribut.innerHTML=controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].nom;
					CellPresent.style.textAlign = "center";
					if (controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].present=="oui") {
						CellPresent.appendChild(imgValider.cloneNode(true));
						//On renseigne le remplissage si le champs est présent
						CellNbElemtsRens.innerHTML=controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].nbEltsRens + 
												"/" + controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].nbEltsTot;
						CellNbElemtsRens.textAlign = "center";
						//Calcul du taux de remplissage en %
						tx=((parseInt(controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].nbEltsRens, 10) / parseInt(controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].nbEltsTot,10))*100).toFixed(2);
						CellTxRemplissage.innerHTML=tx + "%";
						CellTxRemplissage.textAlign = "center";
					}else{
						CellPresent.appendChild(imgCroix.cloneNode(true));
						CellNbElemtsRens.style.backgroundColor = "grey";  
						CellTxRemplissage.style.backgroundColor = "grey";  
					}
					/*La zone commentaire et le bouton modifCommentaire ont un id composé du nom de la couche et du nom du 
					champs (EAU_RAC-implant par exemple), utilisé seulement le nom du champs généraient des confusions 
					car un même no de champ est utilisé dans plusieurs couches (diametre, implant, fourni, ...)	*/
					CellCommentaire.innerHTML=controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].commentaire
					CellCommentaire.id="commchps_"+controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].calque + "-" + controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].nom;
					CellCommentaire.keyCouche=keyCouche;
					CellCommentaire.keyChamp=keyChamp;
					CellModifCommentaire.innerHTML="<td align=\"right\" class=\"tablenone\">"+
							"<input class=\"bouton_image_modif_contenu\" type=\"submit\" id=\""+controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].calque + "-" + controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].nom+"\" value=\" \""+ 
							"title=\"Modifier ou compléter le commentaire\"/>"+
							"</td>";
					
					//Combo pour afficher le résultat du contrôle du champ id=cmboRes+nomDuChamp pour mettre en relation le champ avec le combo
					cmboNewChampResultat=cmboCalqueResult.cloneNode(true);
					cmboNewChampResultat.keyCouche=keyCouche
					cmboNewChampResultat.keyChamp=keyChamp;
					cmboNewChampResultat.value=controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].result;
					switch(cmboNewChampResultat.value) {
						case 'ok':
							cmboNewChampResultat.style.backgroundColor="palegreen";
							break;
							
						case 'ko_nb':
							cmboNewChampResultat.style.backgroundColor="gold";
							break;
						
						case 'ko_b':
							cmboNewChampResultat.style.backgroundColor="orangered";
							break;
						
					}
					cmboNewChampResultat.addEventListener("change",ChangeControleResultChamp);//Changer la couleur de fond selon la valeur sélectionnée
					CellModifResultat.appendChild(cmboNewChampResultat);
					
					if (controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].result=="ko_b") {
						succesTest3=false; 
					}
					
					
					if (indexColumnChamp==1) {indexColumnChamp=0;} 
					var newRow=tableTest3.insertRow();
					
					//Événement sur le bouton modif commentaire de la structure du calque
					CellModifCommentaire.addEventListener("click", modifCommentaireRemplissageChamps);
				}
			}else{
				//La couche existe mais il n'y a pas de champs (Annotations)
				CellCouche.innerHTML=controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].calque;
				var CellCoucheSansChamps=newRow.insertCell(1);
				CellCoucheSansChamps.colSpan=7;
				CellCoucheSansChamps.innerHTML="La structure de la couche n'est pas défini : le nom des champs est libre.";
			}
		}else{
			//La couche est absente
			CellCouche.innerHTML="<strike>"+controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].calque+"</strike>";
			var CellCoucheAbsente=newRow.insertCell(1);
			CellCoucheAbsente.colSpan=7;
			CellCoucheAbsente.innerHTML="La couche est absente du modèle.";
		}
	}
	
	if (succesTest3==true){
		switchTest3.checked=true;
	}else{
		switchTest3.checked=false;
	}
	
	
	
	
	
	/*-----------------------------------------------------------------------
	----------------------------- Événements --------------------------------
	-----------------------------------------------------------------------*/
	boutonComProj.addEventListener("click", modifCommentaireProjection);
	switchTest1.addEventListener("change", modifSwitchTest1);
	switchTest2.addEventListener("change", modifSwitchTest2);
	switchTest3.addEventListener("change", modifSwitchTest3);
	boutonEnregJson.addEventListener("click", enregJson);
}


/*-----------------------------------------------------------------------
----------------------------- Fonctions --------------------------------
-----------------------------------------------------------------------*/

function modifCommentaireProjection(e) {
	/* Modification du commentaire du test de projection
	Événement : click sur bouton permettant de modifier le commentaire du test 1 (controle de la projection
	Action : Passe d'un mode édition au mode consultation 
		En mode consultation : affichage du commentaire
		En mode édition : affichage du commentaire dans un textArea
		Selon le mode le bouton change d'apparence
	*/
	if (e.target.modifEnCours==0) {
		//Mode consultation
		//contenuProjCommentaire.innerHTML=boutonComProj.parametre.Projection[0].commentaire;
		contenuProjCommentaire.innerHTML=controles.Projection[0].commentaire;
		boutonComProj.className="bouton_image_modif_contenu";
		e.target.modifEnCours=1;
	}else{
		//Mode modification
		var txtArea=document.createElement("textarea");
		/*if (typeof boutonComProj.parametre.Projection[0].commentaire !== 'undefined') {
			txtArea.value=boutonComProj.parametre.Projection[0].commentaire;
		}*/
		if (typeof controles.Projection[0].commentaire !== 'undefined') {
			txtArea.value=controles.Projection[0].commentaire;
		}
		contenuProjCommentaire.innerHTML="";
		contenuProjCommentaire.appendChild(txtArea);
		boutonComProj.className="bouton_image_valid_modif_contenu";
		txtArea.addEventListener("change", changeCommentaireProjection);//Appel de la fonction suite à Événement change sur le TextArea
		e.target.modifEnCours=0;
	}
}

function modifCommentaireStructCalques(e) {
	// Modification du commentaire lors du test de structure des calques
	/*
	Événement : click sur les bouton permettant de modifier les commentaires du test 2 (controle des calques
	Action : Passer d'un mode édition au mode consultation 
		En mode consultation : affichage du commentaire
		En mode édition : affichage du commentaire dans un textArea
		Selon le mode le bouton change d'apparence
	Étant donné qu'on boucle sur les calques, l'élémént est récupéré via l'id spécifié dans la fonction main 
	*/
	contenuCalqueCommentaire=document.getElementById("commcalque_"+e.target.id);
	
	if (e.target.modifEnCours==0) {
		//mode Consultation
		contenuCalqueCommentaire.innerHTML=controles.StructureCalques[contenuCalqueCommentaire.keyGrp].calques[contenuCalqueCommentaire.keyCalque].commentaire
		e.target.className="bouton_image_modif_contenu";
		e.target.modifEnCours=1;
	}else{
		//mode Modification
		var txtArea=document.createElement("textarea");
		if (typeof contenuCalqueCommentaire.innerHTML !== 'undefined') {
			txtArea.value=contenuCalqueCommentaire.innerHTML;
		}
		contenuCalqueCommentaire.innerHTML="";
		contenuCalqueCommentaire.appendChild(txtArea);
		e.target.className="bouton_image_valid_modif_contenu";
		//Les paramètres keyGrp et keyCalque permettront de se positionner au bon endroit dans la variable globale controles.
		txtArea.keyGrp=contenuCalqueCommentaire.keyGrp;
		txtArea.keyCalque=contenuCalqueCommentaire.keyCalque;
		txtArea.addEventListener("change", changeCommentaireCalque);
		e.target.modifEnCours=0;
		
	}
}

function modifCommentaireRemplissageChamps(e) {
	// Modification du commentaire lors du test de remplissage des champs
	/*
	Événement : click sur les bouton permettant de modifier les commentaires du test 3 
	Action : Passer d'un mode édition au mode consultation 
		En mode consultation : affichage du commentaire
		En mode édition : affichage du commentaire dans un textArea
		Selon le mode le bouton change d'apparence
	Étant donné qu'on boucle sur les champs, l'élémént est récupéré via l'id spécifié dans la fonction main 
	*/
	contenuChampCommentaire=document.getElementById("commchps_"+e.target.id);
	
	if (e.target.modifEnCours==0) {
		//mode Consultation
		contenuChampCommentaire.innerHTML=controles.StructureCalques[indexCalqueEltNouveau].calques[contenuChampCommentaire.keyCouche].champs[contenuChampCommentaire.keyChamp].commentaire
		e.target.className="bouton_image_modif_contenu";
		e.target.modifEnCours=1;
	}else{
		//mode Modification
		var txtArea=document.createElement("textarea");
		if (typeof contenuChampCommentaire.innerHTML !== 'undefined') {
			txtArea.value=contenuChampCommentaire.innerHTML;
		}
		contenuChampCommentaire.innerHTML="";
		contenuChampCommentaire.appendChild(txtArea);
		e.target.className="bouton_image_valid_modif_contenu";
		//Les paramètres keyGrp et keyCalque permettront de se positionner au bon endroit dans la variable globale controles.
		txtArea.keyCouche=contenuChampCommentaire.keyCouche;
		txtArea.keyChamp=contenuChampCommentaire.keyChamp;
		txtArea.addEventListener("change", changeCommentaireChamp);
		e.target.modifEnCours=0;
		
	}
}






function changeCommentaireProjection(e) {
	/*
	Événement : change sur le Text Area du commentaire du controle 1 (projection)
	Action : On met à jour la variable gobale controles
	*/
	changeJson=true;
	controles.Projection[0].commentaire=e.target.value;
}

function changeCommentaireCalque(e) {
	/*
	Événement : change sur le Text Area du commentaire du controle 2 (calques)
	Action : On met à jour la variable gobale controles on utilise les paramètres keyGrp et keyCalque
	*/
	changeJson=true;
	controles.StructureCalques[e.target.keyGrp].calques[e.target.keyCalque].commentaire=e.target.value;
}

function changeCommentaireChamp(e) {
	/*
	Événement : change sur le Text Area du commentaire du controle 3 (champs)
	Action : On met à jour la variable gobale controles on utilise les paramètres keyCouche et keyChamp
	*/
	changeJson=true;
	controles.StructureCalques[indexCalqueEltNouveau].calques[e.target.keyCouche].champs[e.target.keyChamp].commentaire=e.target.value;
}



function ChangeControleResultCalque(e) {
	/*--------------------------------------------------------------------------------------------------------------------
	Événement : changement de valeur dans les liste déroulantes affcihant le résultat des contrôles de résultat sur les calques
	Action : Chanegemen de la couleur de fond seleon la valeur sélectionnée
			Modification de la valeur "resultat" dans la variable globale conetnant le json
	---------------------------------------------------------------------------------------------------------------------*/
	
	changeJson=true;
	controles.StructureCalques[e.target.keyGrp].calques[e.target.keyCalque].result=e.srcElement.options[e.srcElement.selectedIndex].value;
	switch(e.srcElement.options[e.srcElement.selectedIndex].value) {
		case 'ok':
			e.target.style.backgroundColor="palegreen";
			break;
			
		case 'ko_nb':
			e.target.style.backgroundColor="gold";
			break;
		
		case 'ko_b':
			e.target.style.backgroundColor="orangered";
			break;
	}
}

function ChangeControleResultChamp(e){
	/*--------------------------------------------------------------------------------------------------------------------
	Événement : changement de valeur dans les liste déroulantes affichant le résultat des contrôles de résultat sur les champs
	Action : Chanegemen de la couleur de fond seleon la valeur sélectionnée
			Modification de la valeur "resultat" dans la variable globale conetnant le json
	---------------------------------------------------------------------------------------------------------------------*/
	
	changeJson=true;
	controles.StructureCalques[indexCalqueEltNouveau].calques[e.target.keyCouche].champs[e.target.keyChamp].result=e.srcElement.options[e.srcElement.selectedIndex].value;
	switch(e.srcElement.options[e.srcElement.selectedIndex].value) {
		case 'ok':
			e.target.style.backgroundColor="palegreen";
			break;
			
		case 'ko_nb':
			e.target.style.backgroundColor="gold";
			break;
		
		case 'ko_b':
			e.target.style.backgroundColor="orangered";
			break;
	}
}




function modifSwitchTest1(e) {
	changeJson=true;
	if (e.target.checked==true) {
		controles.Projection[0].result="ok"
	}else{
		controles.Projection[0].result="ko"
	}
}

function modifSwitchTest2(e) {
	changeJson=true;
	if (e.target.checked==true) {
		for (keyGrp in controles.StructureCalques) {
			for (keyCalque in controles.StructureCalques[keyGrp].calques) {
				if (controles.StructureCalques[keyGrp].calques[keyCalque].result=="ko_b") {
					controles.StructureCalques[keyGrp].calques[keyCalque].result="ko_nb"
				}
			}
		}
	}
}

function modifSwitchTest3(e) {
	changeJson=true;
	if (e.target.checked==true) {
		for (keyCouche in controles.StructureCalques[indexCalqueEltNouveau].calques) {
			for (keyChamp in controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs) {
				if (controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].result=="ko_b") {
					controles.StructureCalques[indexCalqueEltNouveau].calques[keyCouche].champs[keyChamp].result="ko_nb"
				}
			}
		}
	}
}

function enregJson() {
	if (changeJson==true) {
		console.log("Enregistrement dans le json")
		ajaxPost("http://tome/intranet/testplanrecol/php/post_json.php?id="+idPlan,controles, enregJsonValide, true);
		changeJson=false;
	}
}

function enregJsonValide(reponse) {
		console.log("Le json a été mis à jour")
		//console.log("json=" + JSON.stringify(controles))
	
}



