ajaxGet("http://tome/intranet/testplanrecol/python/configuration.json", main);


/*
Je suis arrivé où : Paramétrage des chemisn des isones des diiférents objets du plan dans le ficcher python/configuration.json
il faut désormais retrouver ce paramérage et l'implémenter dans Leaflet (options pointToLayer)
Si une icone est paramétré afficher un marker sinon un circleMarker.

Il faut utliser un tabeau associatif : exemple :

var arr = { "un" : 1, "deux" : 2, "trois": 3 };
var y = arr["un"]; --> y=1

*/


//Fonction Main
function main(reponse) {
	
	configJson = JSON.parse(reponse);
	
	
	//On parcourt les tests pour trouver celui qui contient le paramétrage des calques
	for (keyGrp in controles.tests) {
		if controles.tests[keyGrp]=="Test2" {
			for (keyLayer in controles.tests[keyGrp]layers) {
				for (keyRubrique in controles.tests[keyGrp]layers[keyLayer]) {
					/*Créer un tableau associatif dont la clé sera le nom du calque et la valeur le chemin de l'icone*/
				
				}
			}
		}
	}
	
	
	var iconVanne=L.icon({
		iconUrl: '../img/aep/vanne.png',
		iconSize: [21, 12]
	});

	var iconNonType=L.icon({
		iconUrl: '../img/aep/nontype.png',
		iconSize: [11, 18]
	});

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
		switch(feature.properties.Layer) {
				case "EAU_BRAN":
					var co="#ff0000";
					break;
				case "EAU_VAN":
					var co="#0000ff";
					break;
				default:
					var co="#00ff00";
					break;
			}
		console.log("feature.properties.Layer=" + feature.properties.Layer)
		return {
			opacity: 1,
			fillOpacity: 0.7,
			radius: 6,
			color:co
			}
		},
	pointToLayer: function(feature, latlng) {
		switch(feature.properties.Layer) {
				//case 'EAU_BRAN':
				//	var co="#ff0000";
				//	break;
				case 'EAU_VAN':
					var ico=iconVanne;
					break;
				default:
					var ico=iconNonType;
					break;
			}
		/*return L.circleMarker(latlng, {
			opacity: 1,
			fillOpacity: 0.7,
			color: co
			})*/
		return L.marker(latlng,{
			icon: ico
			})
		}
	};

		
	var shpfile = new L.Shapefile('../plans/1/RueGDeGaullePoint.zip',options);


	//Controle gestion d'affichage des fonds de plan
	var fondPlans={
		"OSM": osmcolor,
		"Stamen Toner": mq
		};
		
	var couchePlans={
		"Point": shpfile
		};
	var lc = L.control.layers(fondPlans,couchePlans).addTo(mymap);




	shpfile.addTo(mymap);
	shpfile.once("data:loaded", function() {
		console.log("finished loaded shapefile");
	});
	
}



