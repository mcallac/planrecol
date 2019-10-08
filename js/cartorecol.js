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
		if (configJson.tests[keyGrp]=="Test2") {
			console.log("test2");
			for (keyLayer in configJson.tests[keyGrp].layers) {
				console.log("test2-1");
				for (keyRubrique in configJson.tests[keyGrp].layers[keyLayer]["layers rubrique"]) {
					/*symboCalques est un tableau associatif dont la clé est le nom du calque et la valeur le chemin de l'icone paramétrée dans le fichier configuration.json*/
					console.log("test2-2");
					if (keyRubrique["icone"] != "") {
						console.log("test2-3");
						symboCalques[keyRubrique["calque"]]=L.icon({
										iconUrl: keyRubrique["icone"],
										iconSize: [21, 12]
									});
					}else{
						symboCalques[keyRubrique["calque"]]=null;
					}
				}
			}
		}
	}
	
	console.log("1");
	for(var key in symboCalques)
	{
		var value = symboCalques[key];
		console.log(key + " = " + value + '<br>');
	}
	console.log("2");
	
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
	
	var optionsOk =
		{
			onEachFeature: function(feature, layer) {
				if (feature.properties) {
					layer.bindPopup(Object.keys(feature.properties).map(function(k) {
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
				return {
					opacity: 1,
					fillOpacity: 0.7,
					radius: 6,
					color:co
					}
				},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, {
						opacity: 1,
						fillOpacity: 0.7,
						color: "#00ff00"
					})
				}
		};
	
	
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
		return {
			opacity: 1,
			fillOpacity: 0.7,
			radius: 6,
			color:co
			}
		},
	pointToLayer: function(feature, latlng) {
		//console.log("symBole=" + symboCalques[feature.properties.Layer]);
		if (symboCalques[feature.properties.Layer] != null) {
			return L.marker(latlng,{
				icon: symboCalques[feature.properties.Layer]
			})
		}else{
			return L.circleMarker(latlng, {
				opacity: 1,
				fillOpacity: 0.7,
				color: "#0000ff"
			})
		}

		
		/*
		return L.circleMarker(latlng, {
				opacity: 1,
				fillOpacity: 0.7,
				color: co
			})*/
		
			
		/*
		return L.marker(latlng,{
			icon: ico
			})*/
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



