
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
    view: new ol.View({
        center: ol.proj.fromLonLat([34.7996656, 50.8997286]),
        smoothResolutionConstraint: true, // Enabling smoother transitions between zoom levels
        constrainResolution: false, // Allows intermediate zoom levels
        zoom: 16,
        extent: bounds // Apply the bounds here
    })
   

})

//olms.apply(map, styleJson);

const vectorSource = new ol.source.Vector({wrapX: false});

// Create a vector layer using the vector source
const vectorLayer = new ol.layer.Vector({
    source: vectorSource
    // ,
    // style: new ol.style.Style({
    //     fill: new ol.style.Fill({
    //         color: 'rgba(255, 255, 255, 0.6)', // Change color and opacity as needed
    //     }),
    //     stroke: new ol.style.Stroke({
    //         color: '#ffcc33',
    //         width: 2
    //     })
    // })

});

console.log(map); // Check if the map is initialized
console.log(vectorLayer); 

// Add the vector layer to the map
//map.addLayer(vectorLayer);

// Create a draw interaction for drawing polygon features
const draw = new ol.interaction.Draw({
    source: vectorSource, // Use the vector source for drawing
    type: 'Polygon' // Specify the type of feature to draw
});

// Add the draw interaction to the map
//map.addInteraction(draw);

olms.apply(map, styleJson).then(function() {
    map.addLayer(vectorLayer);
    map.addInteraction(draw);
});

// Optional: Add an event listener if you want to do something when a polygon is drawn
draw.on('drawend', function(event) {
    // Do something with the drawn polygon if needed
    // event.feature is the drawn polygon
    console.log(event.feature); 
});

