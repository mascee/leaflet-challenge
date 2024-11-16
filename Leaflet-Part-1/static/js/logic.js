//All earthquakes past 30 days
//let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//Past 7 days significant earthquakes
//let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

//let url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

//All earthquakes past day
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

//Perform get request to query url
d3.json(url).then(function(data) {
    createFeatures(data.features)
});

function createFeatures(earthquakeData){
    function onEachFeature(feature, layer){
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

// Function to determine the style of the markers
function style(feature) {
    return {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.depth),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

// Function to determine the color based on depth
function getColor(depth) {
    return depth > 100 ? '#FF0000' :
           depth > 50  ? '#FF7F00' :
           depth > 20  ? '#FFFF00' :
                         '#00FF00';
}
// Function to determine the radius based on magnitude
function getRadius(magnitude) {
    return magnitude ? magnitude * 3 : 1;
}

// Function to bind popups to each feature
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3>
                     <hr>
                     <p>Magnitude: ${feature.properties.mag}</p>
                     <p>Depth: ${feature.properties.depth} km</p>
                     <p>${new Date(feature.properties.time)}</p>`);
}

// Create a GeoJSON layer that contains the features array on the earthquakeData object.
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, style(feature));
    }
});

function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
     
    });


// Create baseMaps obeject.  
let baseMaps = {
    "Street Map": street,
    "Topo Map": topo
};

// Create an overlay object to hold our overlay.
let overlayMaps = {
Earthquakes: earthquakes
};

//Creating map object.
let myMap = L.map("map", {
    center: [37.4419, -122.1430],
    zoom: 5,
    layers: [street, earthquakes]
  });

// Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};



  //Adding title layer
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);

// Clean looking map
// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
//     attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
//     subdomains: 'abcd',
//     maxZoom: 19
// }).addTo(myMap);

//Very good looking sattelite image map
// L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//     attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
//     maxZoom: 20
// }).addTo(myMap);


