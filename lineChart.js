var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

let xAxis = d3.axisBottom(x);
let yAxis = d3.axisLeft(y);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

var xGroup = g.append("g")
    .attr("transform", "translate(0," + height + ")");
var zoom = d3.zoom()
    .scaleExtent([1 / 4, 8])
    .translateExtent([[-width, -Infinity], [2 * width, Infinity]])
    .on("zoom", zoomed);
var zoomRect = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .call(zoom);
g.append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);
d3.tsv("data.tsv", type, function(error, data) {
  if (error) throw error;
  var cities = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {date: d.date, temperature: d[id]};
      })
    };
  });
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);
  z.domain(cities.map(function(c) { return c.id; }));
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Temperature, ºF");

  let activeFlagDict = {};
  let filteredCityList = [];
  var city = g.selectAll(".city")
    .data(cities)
    .enter().append("g")
      .attr("class", "city");
  city.append("path")
      .attr("class", "line")
		  .attr("clip-path", "url(#clip)")
			.attr("id", function(d) { return getCityIdForLine(d.id); })
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });
  city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .on("click", function(d){
    		// Filtering
        // Determine if current line is visible
    		let cityId = getCityIdForLine(d.id);
        var active = activeFlagDict[cityId]? false : true,
          newOpacity = active ? 0 : 1;
        // Hide or show the elements
        d3.select("#" + cityId).style("opacity", newOpacity);
        // Update whether or not the elements are active
        activeFlagDict[cityId] = active;
    		if (active){
          filteredCityList.push(cityId);
        }else{
          let city_i = filteredCityList.indexOf(cityId);
          filteredCityList.splice(city_i, 1);
        }
      })
			  // Brushing
      .on("mouseover", function(d){
        let cityId = getCityIdForLine(d.id);
        d3.selectAll(".city")
          .selectAll("path")
          .filter(function(d){
          return cityId != getCityIdForLine(d.id) && !filteredCityList.includes(cityId);
        })
          .transition()
          .style("stroke", "#DCDCDC");

        d3.select("g#" + cityId).raise();
      })
      .on("mouseout", function(d){

        d3.selectAll(".city")
          .selectAll("path")
          .transition()
          .style("stroke", function(d){
          return z(d.id);
        })
      })
      .text(function(d) { return d.id; });
});
function type(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}
function getCityIdForLine(str){
  return str.split(' ').join('');
}
function zoomed() {
  let xz = d3.event.transform.rescaleX(x);
  xGroup.call(xAxis.scale(xz));
  line.x(function(d) {
    return xz(d.date)
  })
  g.selectAll(".line")
    .attr("d", function(d){return line(d.values)});
  g.selectAll(".axis--x").remove();
}
