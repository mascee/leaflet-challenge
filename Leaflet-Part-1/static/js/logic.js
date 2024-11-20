// Function to determine color based on depth
function getColor(depth) {
  if (depth > 90) return "#800000";
  if (depth > 70) return "#b30000";
  if (depth > 50) return "#e60000";
  if (depth > 30) return "#ff1a1a";
  if (depth > 10) return "#ff6666";
  return "#ff9999";
}

//All earthquakes past 30 days
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {
  console.log("Leaflet challenge: earthquakeData", earthquakeData)
  //pointToLayer function changes size of marker depending on magnitude and color depending on depth
  function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, 
      {
        radius: feature.properties.mag * 4,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
    );
  }

  // Function that runs once for each feature in the features array.
  function onEachFeature(feature, layer) {
    // Popup describes the place and time of the earthquake.
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

    //Create a Leaflet GeoJSON layer using earthquake data
    let earthquakes = L.geoJSON(earthquakeData, {
    //Call both functions pointToLayer and onEachFeature
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  
  // Set up the legend
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");

  // Define depths array
  let depths = [-10, 10, 30, 50, 70, 90];

  // Loop through intervals to generate labels with colored squares
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      `<i style="background: ${getColor(depths[i])}; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i>` +
      depths[i] + (depths[i + 1] ? `&ndash;${depths[i + 1]}<br>` : '+');
  }

  return div;
};

// Add the legend to the map
legend.addTo(myMap);

  
}

