
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
				var lats = new Array()
				lats.push(parseFloat(countriesMap[key]["north"]))
				lats.push(parseFloat(countriesMap[key]["south"]))

				var lons = new Array()
				lons.push(parseFloat(countriesMap[key]["west"]))
				lons.push(parseFloat(countriesMap[key]["east"]))

				var diffLat = 0
				if (Math.abs(lats[0] - lats[1]) > 180)
				{
					var diff = ((Math.min(lats[0], lats[1]) + 360.0) - Math.max(lats[0], lats[1])) / 2.0;
					if (Math.abs(diff + Math.max(lats[0], lats[1])) > 180)
						diffLat = Math.min(lats[0], lats[1]) + diff;
					else
						diffLat = Math.max(lats[0], lats[1]) + diff;
				}
				else
					diffLat = (lats[0] + lats[1]) / 2.0

				var diffLon = 0
				if (Math.abs(lons[0] - lons[1]) > 180)
				{
					var diff = ((Math.min(lons[0], lons[1]) + 360.0) - Math.max(lons[0], lons[1])) / 2.0;
					if (Math.abs(diff + Math.max(lons[0], lons[1])) > 180)
						diffLon = Math.min(lons[0], lons[1]) + diff;
					else
						diffLon = Math.max(lons[0], lons[1]) + diff;
				}
				else
					diffLon = (lons[0] + lons[1]) / 2.0

		        bubbles.push({
		            name: key,
		            radius: Math.max(4.0, num),
		            centered: 'BRA',
		            country: key,
		            cheeses: locations[key],
		            fillKey: 'RUS',
				    latitude: diffLat,
				    longitude: diffLon
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
