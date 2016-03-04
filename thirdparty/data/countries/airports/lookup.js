chosenCities = [];

d3.json("cities.json", function(error, latLonList){

	d3.select("#cityList").on("change", function() {
		var errors = [];
		var output = [];
    var multiples = [];
  		chosenCities = this.value.split(',');
  		for(var i = 0; i < chosenCities.length; i++){
  			var k = latLonList[chosenCities[i].toUpperCase().trim()];
  			if(typeof(k) == "undefined"){
          errors.push(chosenCities[i].trim());
        } else {
          if (k.length > 1) {
            multiples.push(chosenCities[i].trim());
          }
          for (var z = 0; z < k.length; z++){
           m = k[z];
           output.push({city: chosenCities[i].trim(), country: m[0], location: {latitude: m[1], longitude: m[2]}});
          }
  			}
  		}

    outputJSON("outputJSON", JSON.stringify(output, undefined, 2));

    postWarnings(errors, "errors", "errorCities", "couldn't be found in the dataset. Try an alternate spelling and the commonly used name in English. If that fails, look it up <a href='http://www.partow.net/miscellaneous/airportdatabase/index.html'>in the original file</a> or on GoogleMaps <a href='http://universimmedia.pagesperso-orange.fr/geo/loc.htm'>here</a>");
    postWarnings(multiples, "multiples", "multipleCities", "listed more than once because there is more than one city with this name or because the city has more than one airport.");
	});

})

function outputJSON(element, text) {
    document.getElementById(element).innerHTML = text;
}

function postWarnings(cities, element, id, text){
      if(cities.length > 0){
        var cityListText = "";
        for(j = 0; j < cities.length; j++){
          if(cities.length == 1){
            cityListText = cities[j];
          } else if (cities.length == 2){
            cityListText = cities[0] + " and " + cities[1];
          } else if(j < cities.length - 1){
            cityListText = cityListText + " " + cities[j] + ",";
          } else {
            cityListText = cityListText + " and " + cities[j];
        }
      }
      document.getElementById(element).innerHTML = "<span id='" + id + "'>" + cityListText + "</span>: " + text; 
    }
}

