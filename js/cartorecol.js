ajaxGet("http://tome/intranet/testplanrecol/python/configuration.json", main);


/*
Je suis arrivé ici : Paramétrage des chemins des icones des différents objets du plan dans le fichier python/configuration.json
il faut désormais retrouver ce paramérage et l'implémenter dans Leaflet (options pointToLayer)
Si une icone est paramétrée afficher un marker sinon un circleMarker.

Il faut utliser un tabeau associatif : exemple :

var arr = { "un" : 1, "deux" : 2, "trois": 3 };
var y = arr["un"]; --> y=1

*/


//Fonction Main
function main(reponse) {
	
	configJson = JSON.parse(reponse);
	
	var symboCalques= new Object();
	//On parcourt les tests pour trouver celui qui contient le paramétrage des calques
	for (keyGrp in configJson.tests) {
		if (configJson.tests[keyGrp].id=="Test2") {
			for (keyLayer in configJson.tests[keyGrp].layers) {
				for (keyRubrique in configJson.tests[keyGrp].layers[keyLayer]["layers rubrique"]) {
					//console.log(configJson.tests[keyGrp].layers[keyLayer]["layers rubrique"][keyRubrique].icone);
					/*symboCalques est un tableau associatif dont la clé est le nom du calque et la valeur le chemin de l'icone paramétrée dans le fichier configuration.json*/
					if (configJson.tests[keyGrp].layers[keyLayer]["layers rubrique"][keyRubrique].icone != "") {
						symboCalques[configJson.tests[keyGrp].layers[keyLayer]["layers rubrique"][keyRubrique].calque]=configJson.tests[keyGrp].layers[keyLayer]["layers rubrique"][keyRubrique].icone;
					}else{
						symboCalques[configJson.tests[keyGrp].layers[keyLayer]["layers rubrique"][keyRubrique].calque]=null;
					}
				}
			}
		}
	}
	
	var mymap = L.map('map').setView([48.800, -3.28], 13);

	var urlstamen = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
	var urlosm='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

	//Couches Fond de plan
	var mq=L.tileLayer(urlstamen, {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
	})

	var osmcolor=L.tileLayer(urlosm,{
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	id: 'mapbox.streets',
	maxZoom: 25
	})

	//Par défaut on affiche le fond de plan OSM
	osmcolor.addTo(mymap);

	//make the map
	var options = {
	onEachFeature: function(feature, layer) {
		if (feature.properties) {
			layer.bindPopup(Object.keys(feature.properties).map(function(k) {
				if(k === '__color__'){
					return;
				}
				return k + ": " + feature.properties[k];
			}).join("<br />"), {
				maxHeight: 200
			});
		}
	},
	style: function(feature) {
		return {
			opacity: 1,
			fillOpacity: 0.5,
			radius: 6,
			color:"#9e9e9e"
			}
		},
	pointToLayer: function(feature, latlng) {
		if (symboCalques[feature.properties.Layer] != null) {
			return L.marker(latlng,{
				icon: L.icon(
				{
					iconUrl: symboCalques[feature.properties.Layer],
					iconSize: [21, 21]
				})
			}).bindTooltip(feature.properties.Layer,{sticky: true}) //Affichage de l'infobulle
		}else{
			return L.circleMarker(latlng, {
				/*opacity: 0.5,
				fillOpacity: 0.5,
				color: "#00ff00"*/
			})
		}
		}
	};

	var shpfile = new L.Shapefile('../plans/1/RueGDeGaullePoint.zip',options);


	//Controle gestion d'affichage des fonds de plan
	var fondPlans={
		"OSM": osmcolor,
		"Stamen Toner": mq
		};
		
	var couchePlans={
		"Appareils": shpfile
		};
	var lc = L.control.layers(fondPlans,couchePlans).addTo(mymap);


	shpfile.addTo(mymap);
	shpfile.once("data:loaded", function() {
		console.log("finished loaded shapefile");
	});
	
	
	//Affichage de la légende
	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend');

		// loop through our density intervals and generate a label with a colored square for each interval
		
		legend_html="<table bgcolor=f2f2f2>";
		for(var key in symboCalques)
		{
			var value = symboCalques[key];
			if (value != null){
				legend_html += "<tr><td align='right'><b>" + key + "</b></td><td> <img src=" + value + " height='25' width='25'> </td></tr>";
			}
		}
		legend_html += "</table>";
		div.innerHTML +=legend_html;
		return div;
	};

legend.addTo(mymap);
}



