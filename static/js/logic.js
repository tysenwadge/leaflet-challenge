//Define the GeoJSON url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Create map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

//Add tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Gather earthquake data and add to map
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Create GeoJSON layer
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                // Popup with earthquake info
                layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km");
            },
            pointToLayer: function (feature, latlng) {
                // Size and color based on magnitude and depth
                var magnitude = feature.properties.mag;
                var depth = feature.geometry.coordinates[2];
                var color = depth < 10 ? 'lightgreen' : depth < 30 ? 'lightyellow' : depth < 50 ? 'lightorange' : depth <70 ? 'orange' : 'red'; // Example color scale
                var radius = magnitude * 3; 

                return L.circleMarker(latlng, {
                    radius: radius,
                    fillColor: color,
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(myMap);

        // Create a legend
        //Tried researching this, found this example but not sure why it's not fully working
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '<strong>Depth (km)</strong><br>';
            div.innerHTML += '<i style="background: lightgreen"></i> < 10<br>';
            div.innerHTML += '<i style="background: orange"></i> 10 - 30<br>';
            div.innerHTML += '<i style="background: green"></i> 30 - 50<br>';
            div.innerHTML += '<i style="background: green"></i> 50 - 70<br>';
            div.innerHTML += '<i style="background: green"></i> 70 - 90<br>';
            div.innerHTML += '<i style="background: green"></i> 90+<br>';
            return div;
        };
        legend.addTo(myMap);
    });