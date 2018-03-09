function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popup_content) {
        layer.bindPopup(
            feature.properties.popup_content
        );
    }
}

var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
    streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});


var roads = L.geoJson([], {
    style: {
        fillColor: '#000',
       /* weight: 2,
        opacity: 0,
        color: '#fff',
        fillOpacity: 0*/
    },
    onEachFeature: onEachFeature,
    maxZoom: 20
});

var roads_geojson_dataurl = "{% url 'core:roads_geojson' %}";

$.getJSON(roads_geojson_dataurl, function (data) {
    roads.addData(data);
});


var map = L.map('map', {
    center: [-7.09544, -36.97998],
    zoom: 8,
    layers: [streets, roads]
});

var baseLayers = {
    "Grayscale": grayscale,
    "Streets": streets
};

var overlays = {
    "Roads": roads,
};

L.control.layers(baseLayers, overlays).addTo(map);
