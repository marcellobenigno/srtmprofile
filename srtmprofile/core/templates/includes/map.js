function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popup_content) {
        layer.bindPopup(
            feature.properties.popup_content
        );
    }
}

function getColor(jurisdiction) {
    switch (jurisdiction) {
        case 'Federal':
            return '#000';
            break;
        case 'Estate':
            return '#ff0000';
        default:
            return '#aaa';
    }
}

function getWeight(jurisdiction) {
    switch (jurisdiction) {
        case 'Federal':
            return 4;
            break;
        case 'Estate':
            return 2;
        default:
            return 1;
    }
}

function roadStyle(feature) {
    return {
        color: getColor(feature.properties.jurisdiction),
        weight: getWeight(feature.properties.jurisdiction),
    };
}

var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
    streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});


var roads = L.geoJson([], {
    style: roadStyle,
    onEachFeature: onEachFeature,
    maxZoom: 20
});

var roads_geojson_dataurl = "{% url 'core:roads_geojson' %}";

$.getJSON(roads_geojson_dataurl, function (data) {
    roads.addData(data);
});

var map = L.map('map', {
    center: [-7.09544, -36.97998],
    zoom: 4,
    layers: [streets, roads]
});

// var corner1 = L.latLng(-8.2991, -38.7527);
// var corner2 = L.latLng(-6.1003, -34.7958);
// var bounds = L.latLngBounds(corner2, corner1);

// console.log(bounds);

// map.fitBounds(bounds);

var baseLayers = {
    "Grayscale": grayscale,
    "Streets": streets
};

var overlays = {
    "Roads": roads,
};

L.control.layers(baseLayers, overlays).addTo(map);
