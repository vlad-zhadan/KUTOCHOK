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


// const vectorNewPolygonSource = new ol.source.Vector({wrapX: false});

// // Create a vector layer using the vector source
// const vectorLayer = new ol.layer.Vector({
//     source: vectorNewPolygonSource
// });

// // Create a draw interaction for drawing polygon features
// const draw = new ol.interaction.Draw({
//     source: vectorNewPolygonSource, // Use the vector source for drawing
//     type: 'Polygon' // Specify the type of feature to draw
// });

// olms.apply(map, styleJson).then(function() {
//     // Add the vector layer to the map
//     map.addLayer(vectorLayer);
//     // Add the draw interaction to the map
//     map.addInteraction(draw);
// });

// // Optional: Add an event listener if you want to do something when a polygon is drawn
// draw.on('drawend', function(event) {
//     // Do something with the drawn polygon if needed
//     // event.feature is the drawn polygon
//     console.log(event.feature); 
// });

