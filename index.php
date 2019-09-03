
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta http-equiv="content-type" content="text/html; charset="utf-8">
  <title>Test des plans de recolement</title>
  <style type="text/css" media="all">@import "css/style.css";</style>
</head>

<body>
  <h2> Test fichier plan de recolement </h2>
  <hr>

<?php

include('php/conn.php');

session_start();

/*------------------------------------------------------
                     CONSTANTES
------------------------------------------------------*/
$nom_rapport="rapport.html";
$json_rapport="rapport.json";
$fic_json="./python/configuration.json";


echo '<form action="" method="post" enctype="multipart/form-data">';
echo '<table border="1" width="100%">';
echo '<tr><td><b>Test script</b></td></tr>';
echo '
<tr>
   <td>	Type de g&eacute;om&eacute;rie : 
		<input type="radio" name ="radio_geom" value="Point">Point
		<input type="radio" name ="radio_geom" value="Ligne">Ligne
   </td>
      <td>Fichier shape <input type="file" id="shape"  name ="file_shp" accept="application/zip"></td>
   </tr>
   <tr>
	<td><input type ="submit" name="ajout_shape" value="ajouter le fichier"</td>
   </tr>
';
echo '</table>';

if (isset($_POST['radio_geom']))
{
   if($_FILES['file_shp']['name']!=""){
	/*--------------------------------------------------
	1. Enregitrement du fichier dans la base de donnés|
	2. Copie du fichier sur le serveur                 |
	--------------------------------------------------*/
	//On copie le fichier sur le serveur
	//Réecuperation de l'id du fichier
	$resulta=pg_query($connex,'SELECT max(id)as maxid FROM planrecol.recol');
	if (!resulta) {
	  echo "Impossible de recuperer le maxid de la table planrecol.recol<br>";
	}else{
	  $arr=pg_fetch_array($resulta,NULL,PGSQL_NUM);
	  $maxid=$arr[0]+1;
	  mkdir('plans/'.$maxid,0777,true);
	  $ret=move_uploaded_file($_FILES['file_shp']['tmp_name'],'plans/'.$maxid.'/'.$_FILES['file_shp']['name']);
	  if(!$ret){
	    echo 'Le transfert du fichier '.$_FILES['file_shp']['name'].' a &eacute;chou&eacute;<br>';
	    switch ($_FILES['file_shp']['error']) {
		case UPLOAD_ERR_NO_FILE :
			echo 'Le fichier '.$_FILES['file_shp']['name'] .' est manquant dans le dossier temporaire <br>';
			break;
		case UPLOAD_ERR_INI_SIZE :
			echo 'Le fichier '.$_FILES['file_shp']['name'] .' d&eacute;passe la taille maximale autoris&eacute;e par php (valeur upload_max_filesize dans le php.ini <br>';
			break;
		case UPLOAD_ERR_FORM_SIZE :
			echo 'Le fichier '.$_FILES['file_shp']['name'] .' d&eacute;passe la taille maximale autoris&eacute;e par le formulaire <br>';
			break;
		case UPLOAD_ERR_PARTIAL :
			echo 'Le fichier '.$_FILES['file_shp']['name'] .' a &eacute;t&eacute; transf&eacute;r&eacute; partiellement <br>';
			break;
	    }
	  }else{
	     //on dézippe le fichie ret on enregistre dans la BD
	     $nomshape=unzip_file('plans/'.$maxid.'/'.$_FILES['file_shp']['name'],'plans/'.$maxid,true);
  	     $query='INSERT INTO planrecol.recol("id","nom_fichier","type_geom")
                     VALUES('.$maxid.',\''.$nomshape.'\',\''.$_POST['radio_geom'].'\')';
	     $resultadd=pg_query($connex,$query);
	     if (! $resultadd) {
        	  echo "Le fichier n'a pas pu etre enregistr&eacute dans la base de donn&eacute;es;";
	          echo "--Erreur dans la requete : $query<br>";
             }
	  }
	}
   }else{
	echo "Aucun fichier shape de sélectionné!";
   	}
}else{
  echo "le type de géométrie n'a pas été sélectionné";
}


if (isset($_POST['script']))
{
  foreach ($_POST['script'] as $cle=>$val) {
    $_SESSION['idfichier']=$cle;
    //Nom du fichier shape
    $query='select nom_fichier,type_geom from planrecol.recol where id='.$_SESSION['idfichier'];
    $result=pg_query($connex,$query);
    if (!$result) {
	echo "Erreur requete : $query (impossible de trouver le nom du fichier dans la BD";
    }else{
	$arr=pg_fetch_array($result,NULL,PGSQL_ASSOC);
	$ficshp=$arr['nom_fichier'];
	$typegeom=$arr['type_geom'];
	//Execution du script python
	$workspace=getcwd().'/plans/'.$_SESSION['idfichier'];
	$cmd='python ./python/testshp.py '.$workspace.' '.$fic_json.' '.$ficshp.' '.$typegeom;
	exec($cmd,$output,$ret);
	if ($ret!=0){
		$liberr=$output[count($output)-1];
		echo "<br>Erreur dans le script python (code=$ret) : $liberr";
	}
    }
  }
}



/*--------------------------------------------------------------------------------------------------------------------
                                              CONSULTATION DU RAPPORT
--------------------------------------------------------------------------------------------------------------------*/
if (isset($_POST['voir_info'])){
  foreach ($_POST['voir_info'] as $cle=>$val) {
    $rapport=$cle.'/'.$nom_rapport;
    //echo '<script type="text/javascript" language="Javascript">window.open(\''.$rapport.'\');</script>';
    echo '<script type="text/javascript" language="Javascript">window.open(\'./html/'.$nom_rapport.'?id='.$cle.'\');</script>';
  }
}

/*------------------------------------------------------------------------------------------------------------------
                                               SUPPRESSION D'UN TEST
-------------------------------------------------------------------------------------------------------------------*/

if (isset($_POST['deltest']))
{
   foreach ($_POST['deltest'] as $cle=>$val){
	$_SESSION['idfichier']=$cle;
   }
   $query='select nom_fichier from planrecol.recol where id='.$_SESSION['idfichier'];
   $result=pg_query($connex,$query);
   if (!$result){
	echo "Erreur requete : ".$query;
   }else{
	for($i=1;$i<=pg_num_rows($result);$i++){
	  $arr=pg_fetch_array($result,NULL,PGSQL_ASSOC);
	  echo 'Confirmez-vous la suppression du test du fichier : '.$arr['nom_fichier'].'(id='.$_SESSION['idfichier'].')';
	  echo '<input type="submit" name="btonvalid" value="oui">
		<input type="submit" name="btonannul" value="non">';

          }
   }
   exit;
}

//Validation de la suppression
if ($_POST['btonvalid']=="oui"){
  //On supprime le fichier de la base de données et le dossier du serveur
  echo '<br>suppression du test : '.$_SESSION['idfichier'].'<br>';
  $query='DELETE FROM planrecol.recol WHERE id='.$_SESSION['idfichier'];
  $result=pg_query($connex,$query);
  if (!$result) {
    echo '<font color = "#FF0000"> La suppression dans la BD a &eacute;chou&eacute; !</font>';
  }
 $output=shell_exec('rm -rf plans/'. $_SESSION['idfichier']);

}
/*------------------------------------------------------------------------------------------------------------------------------------*/



//Affichage de la liste des plans
$resulta=pg_query($connex,'SELECT id, nom_fichier, type_geom, result_control,commentaire FROM planrecol.recol order by id'); 
if (! $resulta) {
	echo "erreur de requête lors de la récupération l'historique des plans test&eacute;s";
}else{
	echo "<table width=\"100%\" border=\"1\">";
	while ($row=pg_fetch_row($resulta)) {
		$res=$row[3];//result du ctrl Null : le controle n'a pas ete execute, ok, ko
		$id=$row[0];
		$fic=$row[1];
		$typ_geom=$row[2];
		echo "<tr>";
			echo "<td>".$id."</td>";
			echo "<td>".$fic."</td>";
			echo "<td>".$typ_geom."</td>";
			echo "<td>".$row[3]."</td>";
			echo "<td>".$row[4]."</td>";

			echo '<td class="cellicon"><input class="image_script" type="submit" name="script['.$id.']" value=" " title="Ex&eacute;cuter le script"/></td>';
			if (file_exists('./plans/'.$id.'/'.$json_rapport)){
			//if (1==1){
			    echo '<td class="cellicon"><input class="image_info" type="submit" name="voir_info['.$id.']" value=" " title="Ouvrir le rapport"/></td>';
			    echo '<td class="cellicon"><input class="image_map" type="submit" name="voir_carte['.$id.']" value=" " title="Localiser les erreurs"/></td>';
			}else{
			    echo '<td class="cellicon"></td>';
			    echo '<td class="cellicon"></td>';
			}
			/*
			switch ($res) {
			  case 'ok':
			    echo '<td class="cellicon"><img src="img/verif_succeed.png" class="border_image_icon"  title="Test effectu&eacute; avec succ&egrave;s"/></td>';
			    echo '<td class="cellicon"><input class="image_info" type="submit" name="info['.$id.']" value=" " title="Ouvrir le rapport"/></td>';
			    break;
			  case 'ko':
			    echo '<td class="cellicon"><img src="img/verif_error.png" class="border_image_icon"  title="Test avec erreur"/></td>';
			    echo '<td class="cellicon"><input class="image_info" type="submit" name="info['.$id.']" value=" " title="Ouvrir le rapport"/></td>';
			    break;

			  default:
			    echo '<td class="cellicon"><input class="image_script" type="submit" name="script['.$id.']" value=" " title="Ex&eacute;cuter le script"/></td>';
			    echo '<td class="cellicon"></td>';
			    break;
			}*/
			echo '<td class="cellicon"><input class="image_suppr" type="submit" name="deltest['.$id.']" value=" " title="Supprimer le test"/></td>';

		echo "</tr>";
	}
	echo "</table>";
}

// On détruit les variables de notre session
session_unset ();

// On détruit notre session
session_destroy ();


function unzip_file($file, $destination, $del_zip_after) {
	// Créer l'objet (PHP 5 >= 5.2)
	$zip = new ZipArchive() ;
	// Ouvrir l'archive

	if ($zip->open($file) !== true) {
		echo 'Impossible d\'ouvrir l\'archive '.$file;
	}

	$zip->extractTo($destination);
	$zip->close();
	if ($del_zip_after==true) {
	   unlink($file);
	}
	//On retourne le nom du shp
	//return "toto";
	$fichiers=scandir($destination);
	foreach ($fichiers as $fic){
	   $extension = pathinfo($fic, PATHINFO_EXTENSION);
	   if ($extension == 'shp') {
		return $fic;
	   }
	}
}































?>
</form>
</body>
</html>


