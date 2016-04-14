var map = new Datamap({
    element: document.getElementById('container'),
    responsive: true
});

// Alternatively with d3
d3.select(window).on('resize', function() {
    map.resize();
});