maptilersdk.config.apiKey = 'Wllbp5hPJZa4ZoFvKPiW';

const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.STREETS,
    center: [34.7996656, 50.8997286], // starting position [lng, lat]
    zoom: 15, // starting zoom
});

const bounds = new maptilersdk.LngLatBounds(
    new maptilersdk.LngLat(34.77, 50.88), // SW point, slightly southwest of Sumy
    new maptilersdk.LngLat(34.83, 50.94)  // NE point, slightly northeast of Sumy
);

map.setMaxBounds(bounds);

map.on('load', async function () {
    const geojson = await maptilersdk.data.get('5ec9c329-f656-43d0-8827-e9f49ced6730');
    map.addSource('rio_cats', {
        type: 'geojson',
        data: geojson
    });

    map.addLayer({
        'id': 'rio_cats',
        'type': 'fill',
        'source': 'rio_cats',
        'layout': {},
        'paint': {
            'fill-color': '#98b',
            'fill-opacity': 0.4
    }});

    map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'rio_cats',
        'layout': {},
        'paint': {
            'line-color': '#888',
            'line-width': 2
    }});


    map.on('click', 'rio_cats', function (e) {
        new maptilersdk.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<h3>' + "Cat pack name" + '</h3>')
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'rio_cats', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'rio_cats', function () {
        map.getCanvas().style.cursor = '';
    });

});
