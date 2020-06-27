const map = new Datamap({
    element: document.getElementById("container"),
    responsive: true,
    geographyConfig: {
        popupOnHover: false,
        highlightOnHover: false
    },
    fills: {
        defaultFill: "#ABDDA4",
        USA: "blue",
        RUS: "red"
    }
});

d3.json("/cheeses/locations.json", (error, locations) => {
    bubbles = [];

    for (var key in locations) {
        num = parseFloat(locations[key].count) / 10.0;

        bubbles.push({
            name: key,
            radius: Math.max(4.0, num),
            centered: "BRA",
            country: key,
            cheeses: locations[key],
            fillKey: "RUS",
            latitude: locations[key].lat,
            longitude: locations[key].long
        });
    }

    map.bubbles(bubbles, {
        popupTemplate(geo, data) {
            return `<div class="hoverinfo">${locations[key].count} cheeses in ${data.name}`;
        }
    });
});

d3.select(window).on("resize", () => {
    map.resize();
});
