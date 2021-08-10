/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-undef */

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

    for (const key in locations) {
        const num = parseFloat(locations[key].count) / 10.0;

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
        popupTemplate(_, data) {
            return `<div class="hoverinfo">${locations[data.name].count} cheeses in ${data.name}`;
        }
    });
});

d3.select(window).on("resize", () => {
    map.resize();
});
