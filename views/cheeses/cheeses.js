
var map = new Datamap({
    element: document.getElementById('container'),
    responsive: true,
    geographyConfig: {
        popupOnHover: false,
        highlightOnHover: false
    },
    fills: {
        defaultFill: '#ABDDA4',
        USA: 'blue',
        RUS: 'red'
    }
});

d3.json("/map/countries/country-geo-cordinations.json", function(error, countries) {
	countriesMap = {}
	var countriesLength = countries.length;
	for (var i = 0; i < countriesLength; i++) {
		countriesMap[countries[i]["country"]] = countries[i]
	}


	d3.json("/cheeses/locations.json", function(error, locations) {
	    bubbles = []

		for (var key in locations) {
		    num = parseFloat(locations[key]) / 10.0;

		    if (key in countriesMap)
		    {
				long = (parseFloat(countriesMap[key]["west"]) + parseFloat(countriesMap[key]["east"])) / 2.0;
				lat = (parseFloat(countriesMap[key]["north"]) + parseFloat(countriesMap[key]["south"])) / 2.0;

		        bubbles.push({
		            name: key,
		            radius: Math.max(4.0, num),
		            centered: 'BRA',
		            country: key,
		            cheeses: locations[key],
		            fillKey: 'RUS',
				    latitude: lat,
				    longitude: long
		        });
		    }
		}

	    map.bubbles(bubbles, {
	        popupTemplate: function(geo, data) {
	            return '<div class="hoverinfo">' + data.cheeses + ' cheeses in ' + data.name
	        }
	    });
	});
});

d3.select(window).on('resize', function() {
    map.resize();
});
