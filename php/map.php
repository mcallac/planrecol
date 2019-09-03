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
	
	<!-- appelle la librairie javascript Leaflet et le fichier CSS Leaflet -->	
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
		integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
		crossorigin=""/>
	<script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"
		integrity="sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=="
	crossorigin=""></script>
	
	<!-- Lien vers mabibliothèque javascript -->	
	<script src="../js/ajax.js"></script>
	
	<!-- jQuery - indispensable pour utiliser les fichiers geojson -->
	<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
	
	
	
</head>

<body>
	
	<div id="calque_titre_feuille">
		<h1 id="nom_plan">Visualisation du plan de récolement</h1>
	</div>
		
	<div id="map"></div>
	
	
	
	<script src="../js/cartorecol.js"></script>

</body>

</html>