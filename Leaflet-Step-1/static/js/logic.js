////////////////////////////////////////////////////////////////////////
/// This is the required part of the leaflet homework (week 17)
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
/// This first section defines the data and reads it in, then passes
/// it to a function that will create the chart
///////////////////////////////////////////////////////////////////////

// Assign the URL (I used the number of earthquakes in last week)
var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// read in the json data

d3.json(url, function(data) {

    // assign the json object to a variable  
    var earthQuakeData = data;
    
    // call function to create map and pass the object
    createMap(earthQuakeData);
});

///////////////////////////////////////////////////////////////////////
/// This next section defines a function that will take the json data
/// and create the chart, add circles with defined colors and size based
/// on magnitude.  It also defines a legend.
///////////////////////////////////////////////////////////////////////

// Function createMap receives the earthquake data and creats the map, then adds circles   
function createMap(earthQuakeData) {

  // create the map
  var myMap = L.map("map", {
    center: [39.09, -110.71],
    zoom: 4.6,
  });

  // add the light map layer to myMap
  var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,id: "mapbox.light", accessToken: API_KEY
  }).addTo(myMap);

  // The assignColor function is used to assign the color for the circles based on the magnitude
  function assignColor(mag) {
    if (mag <= 1){
      color = "greenyellow";
    }
    else if (mag <= 2){
      color = "#FCF3CF";
    }
    else if (mag <= 3){
      color = "#FED976";
    }
    else if (mag <= 4){
      color = "#FEB24C";
    }
    else if (mag <= 5){
      color = "#FD8D3C";
    }
    else {
      color = "#FC4E2A";
    }
    return color;
  }

  // iterate through the features of the earthquake data and create cirles
  // bind a popup for each and add them to map
  earthQuakeData.features.forEach(function(earthquake){
   
    L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      stroke: true,
      fillOpacity: 0.75,
      color: "black",
      weight: 0.25,

      // Call the assignColor function to get fill color based on magnitude
      fillColor: assignColor(earthquake.properties.mag),

      // Assign the radius based on the magnitude (they circles were small, so had to multiply by a large number to 
      // get a reasonable size)
      radius: earthquake.properties.mag*10000
    }).bindPopup(`<h3> ${earthquake.properties.place} </h3> <hr> <p> ${Date(earthquake.properties.time)} </p> <hr>
      <p>Magnitude: ${earthquake.properties.mag}</p>`)
      .addTo(myMap);

  })

  // Add the legend (also added styling in the style.css to get it to look right)
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0, 1, 2, 3, 4, 5],
        labels = ["0-1","1-2","2-3","3-4","4-5","5+"];

    // loop through our magnitude intervals and generate a label with a colored square for each interval using
    // the same function that was used to generate colors of the circles
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + assignColor(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);
  
}