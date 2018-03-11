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
        case 'Estadual':
            return ' #994d00';
        default:
            return '#aaa';
    }
}

function getWeight(jurisdiction) {
    switch (jurisdiction) {
        case 'Federal':
            return 4;
            break;
        case 'Estadual':
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

var div = 'map';
var map_center = [-7.09544, -36.97998];
var zoom_init = 8;
var layers = [streets, roads];

// caso exista obj, a pag. é detail.html
var obj = '{{ obj.geom.json|safe }}';
var init_x = '{{ init_x|safe }}';
var init_y = '{{ init_y|safe }}';
var end_x = '{{ end_x|safe }}';
var end_y = '{{ end_y|safe }}';

var detailStyle = {
    "color": '#ffff00',
    "weight": 10,
    "opacity": 0.4
};

if (obj) {
    div = 'map-detail';
    road = L.geoJson(JSON.parse(obj),  {style: detailStyle});
    road_group = new L.featureGroup([road,]);
    layers = [streets, roads, road_group]
}

var map = L.map(div, {
    center: map_center,
    zoom: zoom_init,
    layers: layers
});

if (obj) {
    map.fitBounds(road_group.getBounds());

    var starts = L.circle([init_y, init_x ], {
        color: '#00e600',
        fillColor: '#00e600',
        fillOpacity: 0.9,
        radius: 150
    }).addTo(map);

    var ends = L.circle([end_y, end_x ], {
        color: '#ff3300',
        fillColor: '#ff3300',
        fillOpacity: 0.9,
        radius: 150
    }).addTo(map);
}

var baseLayers = {
    "Grayscale": grayscale,
    "Streets": streets
};

var overlays = {
    "Roads": roads,
};

L.control.layers(baseLayers, overlays).addTo(map);
