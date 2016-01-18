var margin = {top: 20, right: 120, bottom: 20, left: 120},
  width = 960 - margin.right - margin.left,
  height = 800 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
  .size([height, width]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the external data
d3.json("recipes.json", function(error, treeData) {
  root = treeData[0];
  update(root);
});

function update(source)
{
  var test = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("fill", "yellow")
      .text(source.ingredients);

  var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("fill", "yellow")
      .attr('width', 200)
      .text(source.description);

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Declare the nodes…
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("circle")
    .attr("r", 10)
    .style("fill", "#fff")
    .on("mouseover", function(){return tooltip.style("visibility", "visible");})
    .on("mousemove", function(){return tooltip.style("top",
      (d3.event.pageY+20)+"px").style("left",(d3.event.pageX+50)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

  nodeEnter.append("text")
    .attr("x", function(d) {
      return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1);

  // Declare the links…
  var link = svg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", diagonal);

    var xx = 50;
    var yy = 20;
    var offsetx = 10;
    var offsety = 10;
    var ww = 200;
    var hh = 200;
    var buffer = 10;
  var test = d3.select("body").append('svg')
                          .attr('height', hh)
                          .attr('width', ww + buffer)
          rect = svg.append('rect').transition().duration(500)
                          .attr('width', ww)
                          .attr('height', hh + buffer)
                          .attr('x', xx)
                          .attr('y', yy)
                          .style('fill', 'none')
                          .attr('stroke', 'black')
          text = svg.append('foreignObject')
                          .attr('x', xx + offsetx)
                          .attr('y', yy + offsety)
                          .attr('width', ww)
                          .attr('height', hh)
                          .append("xhtml:body")
      .html('<div style="width: ' + (ww - offsetx * 2) + 'px;">' + source.description + '</div>');

}