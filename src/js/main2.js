async function loadGeoJson(url) {
    const response = await fetch(url);
    const geojson = await response.json();
    return geojson;
}


const key = 'Wllbp5hPJZa4ZoFvKPiW';
const styleJson = `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`;

const attribution = new ol.control.Attribution({
    collapsible: false,
});

const bounds = ol.proj.transformExtent(
    [34.77, 50.88, 34.83, 50.94], // [minX, minY, maxX, maxY] in longitude and latitude
    'EPSG:4326', // Source projection (longitude/latitude)
    'EPSG:3857'  // Target projection (web mercator)
);

const map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults.defaults({ attribution: false }).extend([attribution]),
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([34.7996656, 50.8997286]),
        smoothResolutionConstraint: true, // Enabling smoother transitions between zoom levels
        constrainResolution: false, // Allows intermediate zoom levels
        zoom: 16,
        extent: bounds // Apply the bounds here
    })
   

})

const vectorSource = new ol.source.Vector();

const fillLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(152, 187, 187, 0.4)' // #98b with opacity
        })
    })
});

const outlineLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#888',
            width: 2
        })
    })
});

olms.apply(map, styleJson).then(function() {
    map.addLayer(fillLayer);
map.addLayer(outlineLayer);
});


map.on('singleclick', function(event) {
    map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
        // Implement a popup or other feature interaction
        console.log('Clicked feature', feature);
    });
});

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(overlay);

map.on('singleclick', function(event) {
    const feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
        return feature;
    });

    if (feature && feature.get('name')) {
        // Here you can retrieve and show any information you need from the feature
        // For example, if your feature has a property 'name':
        const featureName = feature.get('name') || 'No information available';
        let infoHtml = '<p>Polygon Information:</p>';

        const featureInfo = feature.getProperties();
        console.log(featureInfo)
         for (const key in featureInfo) {
            if (featureInfo.hasOwnProperty(key) && key !== 'geometry') {
                infoHtml += '<div><strong>' + key + ':</strong> ' + featureInfo[key] + '</div>';
            }
        }

        // Set the content of the popup
        content.innerHTML = infoHtml;

        // Set the content of the popup
        //content.innerHTML = '<p>Polygon Information:</p><div>' + featureInfo + '</div>';

        // Set the position of the popup
        overlay.setPosition(event.coordinate);
    }
    if(!feature.get('name')){
        overlay.setPosition(undefined);
    }
});




map.on('pointermove', function(event) {
    if (map.hasFeatureAtPixel(event.pixel)) {
        map.getTargetElement().style.cursor = 'pointer';
    } else {
        map.getTargetElement().style.cursor = '';
    }
});

// Replace with your GeoJSON URL
const geoJsonUrl = 'https://api.maptiler.com/data/5ec9c329-f656-43d0-8827-e9f49ced6730/features.json?key=Wllbp5hPJZa4ZoFvKPiW';
loadGeoJson(geoJsonUrl).then(geojson => {
    vectorSource.addFeatures(
        new ol.format.GeoJSON().readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    );
});


const vectorNewPolygonSource = new ol.source.Vector({wrapX: false});
const vectorLayer = new ol.layer.Vector({
    source: vectorNewPolygonSource
});

// Initialize draw interaction but don't add it to the map yet
const draw = new ol.interaction.Draw({
    source: vectorNewPolygonSource,
    type: 'Polygon'
});

olms.apply(map, styleJson).then(function() {
    map.addLayer(vectorLayer);
    // Don't add the draw interaction here
});

// Toggle draw interaction
let isDrawing = false; // Flag to track the drawing state

document.querySelector('.draw-button').addEventListener('click', function() {
    if (isDrawing) {
        // If currently drawing, remove the interaction
        map.removeInteraction(draw);
    } else {
        // If not drawing, add the interaction
        map.addInteraction(draw);
    }
    isDrawing = !isDrawing; // Toggle the state
});

draw.on('drawend', function(event) {
    console.log(event.feature);
    // Optional: Automatically disable drawing after a feature is drawn
    map.removeInteraction(draw);
    isDrawing = false;
});