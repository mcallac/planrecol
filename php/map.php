<?php
	header('Access-Control-Allow-Origin: *');
?>
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Carto plan</title>
	<!-- lien vers mes fichiers CSS -->
	<style type="text/css" media="all">
		@import "../css/style_map.css";
		@import "../css/interrupt.css";
	</style>

	<!-- CSS-->	
	<link rel="stylesheet" href="../css/leaflet/leaflet.css"/>
</head>

<body>
	<div id="calque_titre_feuille">
		<h1 id="nom_plan">Visualisation du plan de récolement</h1>
	</div>
	<div id="map"></div>
	<!-- Lien vers bibliothèques javascript -->	
	<script src="../js/leaflet/leaflet.js"></script>
	<script src="../js/ajax.js"></script>
	<script src="../js/leaflet/catiline.js"></script>
	<script src="../js/leaflet/leaflet.shpfile.js"></script>
	<!-- jQuery - indispensable pour utiliser les fichiers geojson -->
	<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
	
	<script src="../js/cartorecol.js"></script>
	

</body>

</html>