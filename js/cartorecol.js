var mymap = L.map('map').setView([48.800, -3.28], 13);

var idPlan=getUrlParam('id');

ajaxGet("http://tome/intranet/testplanrecol/plans/"+idPlan+"/plan.geojson", initialize);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	id: 'mapbox.streets',
	maxZoom: 19
}).addTo(mymap);

function initialize(reponse) {
	// Transforme la réponse en un tableau d'articles
	geojsonFeature = JSON.parse(reponse);
	//L.geoJSON(geojsonFeature).addTo(mymap);
	
	// création d’une couche geoJson qui appelle le fichier « cinema.geojson »
	//var urlPlanGeoJson="/plans/" + idPlan + "/plan.geojson"
	
	
	/*var recolpoint= $.getJSON(urlPlanGeoJson,function(dataPointPlan)
	// icone
	{var iconePointPlan = L.icon({
	iconUrl : 'img/info.png',
	iconSize : [19, 21]
	});
	// fonction pointToLayer qui ajoute la couche « dataPointPlan » à la carte, selon la symbologie « iconePointPlan », et paramètre la popup
	L.geoJson(dataPointPlan,{
	pointToLayer : function(feature,latlng){
	var marker = L.marker(latlng,{icon: iconePointPlan});
	marker.bindPopup('<b><u>Description du Point</u></b><br>'
	+ '<b>Layer : </b>' + feature.properties.Layer + '<br>'
	+ '<b>RefName : </b>' + feature.properties.RefName + '<br>'
	);
	return marker ;
	}
	}).addTo(map);
	});*/
	
	var geojsonMarkerOptions = {
	radius: 8,
	fillColor: "#ff7800",
	color: "#000",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.8
	};
	
	
	var recolpointLayer = new L.GeoJSON.AJAX(geojsonFeature);
	
	L.geoJSON(recolpointLayer, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, geojsonMarkerOptions);
	}
}).addTo(map);
	
	
	

	
}