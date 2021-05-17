
// All earthquakes Past 7 Days URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Read through D3
d3.json(url).then(function(data){
 
    createFeatures(data.features);
    // console.log(data.features)
});


// create the features
function createFeatures(earthquakeData) {

    // get place, time, mag and coordinates
    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3><hr><p>" + new Date(feature.properties.time) + 
        "</h3><hr><p>" + "Magnitude: " + feature.properties.mag +"</p>" + 
        "</h3><hr><p>" + "Depth: " + feature.geometry.coordinates[2] + " km" +"</p>");
    }
    
    // get marker size
    function markerSize(mag){
        return mag * 50000;
    }

    // get marker colors as per level 1
    function markerColor(depth){
        if (depth > 90) {
            return "red"
        }
        else if (depth > 70){
            return "darkorange"
        }
        else if (depth > 50){
            return "orange"
        }
        else if (depth > 30) {
            return "yellow"
        }
        else if (depth > 10) {
            return "darkgreen"
        }
        else {
            return "lightgreen"
        }
    }
    
    // get marker
    function createMarker(feature, latlng){
        return L.circle(latlng, {
            radius: markerSize(feature.properties.mag),
            color: markerColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.5,
            borderColor: "black",
            stroke: false
        })
    };

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    })
    
    
    // call create map function here to create the map
    createMap(earthquakes);
}


// create map function
function createMap(earthquakes){
    
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });


    var baseMaps = {
        "Street Map": street, 
        "Topographic Map": topo
        };


    var overlayMaps = {
        Earthquakes: earthquakes
        };


    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 2,
        layers: [street, topo, earthquakes]
        });


    function getColor(depth) {
        return depth > 90  ? "#ff0000" :
            depth > 70  ? "#ff8c00" :
            depth > 50   ? "#ffa500" :
            depth > 30   ? "#ffff00" :
            depth > 10   ? "#006400" :
                        "#90ee90";
        }

    var legend = L.control({position: "bottomright"});


    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90]


    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }
    
        return div;
        
    };

    legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

};