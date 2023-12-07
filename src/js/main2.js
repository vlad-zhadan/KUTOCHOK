



const mapTilerKey = 'Wllbp5hPJZa4ZoFvKPiW';
const mapTilerUrl = `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${mapTilerKey}&scaleFactor=@2x`;

const map = new ol.Map({
    target: 'map',
    layers: [
         new ol.layer.VectorTile({
            source: new ol.source.VectorTile({
                format: new ol.format.MVT(),
                url: `https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=${mapTilerKey}`,
                tileSize: 512, // MapTiler's vector tiles are 512x512
                maxZoom: 14 // Adjust max zoom as needed
            })
        }),
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: mapTilerUrl
            })
        })
       
    ],
    
        
    
    view: new ol.View({
        center: ol.proj.fromLonLat([34.7996656, 50.8997286]), // Replace with your coordinates
        zoom: 20
        
    })
});

const vectorSource = new ol.source.Vector({wrapX: false});

// Create a vector layer using the vector source
const vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

// Add the vector layer to the map
map.addLayer(vectorLayer);

// Create a draw interaction for drawing polygon features
const draw = new ol.interaction.Draw({
    source: vectorSource, // Use the vector source for drawing
    type: 'Polygon' // Specify the type of feature to draw
});

// Add the draw interaction to the map
map.addInteraction(draw);

// Optional: Add an event listener if you want to do something when a polygon is drawn
draw.on('drawend', function(event) {
    // Do something with the drawn polygon if needed
    // event.feature is the drawn polygon
});