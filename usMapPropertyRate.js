//Width and height
let w = 1000;
let h = 600;
let margin = {top: 130, right: 20, bottom: 100, left: 150};
let fileName = "state_crime.csv";
let colorOptions = ["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"];
// let colorOptions = ["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"];
let cityCircleSize = [5, 25];
let plotTitleFontStyle = "20px sans-serif";
let plotSubTitleFontStyle = "14px sans-serif";

var projection = d3.geoAlbersUsa().translate([w/2, h/2]).scale([1000]);

//Define path generator, using the Albers USA projection
var path = d3.geoPath()
             // .projection(d3.geoAlbersUsa());
             .projection(projection);

var numColors = 9;

//Define quantize scale to sort data values into buckets of color
var color = d3.scaleQuantize()
                    // .range(colorOptions);
                    .range(colorbrewer.Reds[numColors]);
                    //Colors derived from ColorBrewer, by Cynthia Brewer, and included in
                    //https://github.com/d3/d3-scale-chromatic

var circleScale = d3.scaleLinear().range(cityCircleSize);

//Number formatting for population values
var formatAsThousands = d3.format(",");  //e.g. converts 123456 to "123,456"

//Create SVG element
var svg = d3.select("#containerMap")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("id", "svg_map");

//Load in agriculture data
d3.csv(fileName, function(error, data) {
    if (error) throw error;

    let dataInDict = dataPreprocessing(data);
    dataInDict = d3.entries(dataInDict);

    //Set input domain for color scale
    color.domain([
        d3.min(dataInDict, function(d) { return d.value; }),
        d3.max(dataInDict, function(d) { return d.value; })
    ]);

    //Load in GeoJSON data
    d3.json("us-states.json", function(json) {

        //Merge the ag. data and GeoJSON
        //Loop through once for each ag. data value
        for (var i = 0; i < dataInDict.length; i++) {

            var dataState = dataInDict[i].key;
            var dataValue = dataInDict[i].value;

            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {

                var jsonState = json.features[j].properties.name;

                if (dataState == jsonState) {

                    //Copy the data value into the JSON
                    json.features[j].properties.value = dataValue;

                    //Stop looking through the JSON
                    break;

                }
            }
        }

        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .attr("class", "pointer")
           .attr("id", function(d){
               return "click_" + d.properties.name;
           })
           .style("fill", function(d) {
                //Get data value
                var value = d.properties.value;

                if (value) {
                    //If value exists…
                    return color(value);
                } else {
                    //If value is undefined…
                    return "#ccc";
                }
           })
           .append("title")			//Simple tooltip
           .text(function(d) {
            	return d.properties.name + ": Rate. " + formatAsThousands(d.properties.value);
           })
           ;

          // main title
          svg.append("text")
              .style("font", plotTitleFontStyle)
              .attr("text-anchor", "middle")
              .attr("transform", "translate("+ (w/2) +","+(margin.top/2)+")")
              .text("Property");

          svg.append("text")
              .style("font", plotSubTitleFontStyle)
              .attr("text-anchor", "middle")
              .attr("transform", "translate("+ (w/2) +","+(margin.top/2 + 30)+")")
              .text("# of Reported Offenses per 100,000 Population");

        //    //Load in cities data
        // d3.csv("us-cities.csv", function(data) {
        //
        //     circleScale.domain([
        //         d3.min(data, function(d) { return Math.sqrt(d.population); }),
        //         d3.max(data, function(d) { return Math.sqrt(d.population); })
        //     ])
        //
        // 	svg.selectAll("circle")
        // 	   .data(data)
        // 	   .enter()
        // 	   .append("circle")
        // 	   .attr("cx", function(d) {
        // 		   return projection([d.lon, d.lat])[0];
        // 	   })
        // 	   .attr("cy", function(d) {
        // 		   return projection([d.lon, d.lat])[1];
        // 	   })
        //        .attr("r", function(d) {
        // 		   return circleScale(Math.sqrt(d.population));
        // 	   })
        // 	   .style("fill", "#fc8d59")
        // 	   .style("stroke", "gray")
        // 	   .style("stroke-width", 0.25)
        // 	   .style("opacity", 0.75)
        // 	   .append("title")			//Simple tooltip
        // 	   .text(function(d) {
        // 			return d.place + ": Pop. " + formatAsThousands(d.population);
        // 	   });
        //
        // });

    });

});

function dataPreprocessing(data) {
    let dataDict = {};
    let valueColName = "Rates.Property.All";
    let keyColName = "State";

    data.forEach(function(d) {
       let colName = "";
       if (d[keyColName] in dataDict){
           dataDict[d[keyColName]].push(parseFloat(d[valueColName]));
       }else{
           dataDict[d[keyColName]] = [parseFloat(d[valueColName])];
       }
    });

    let dataDictKeysArr = d3.keys(dataDict);

    for (let i = 0; i < dataDictKeysArr.length; i++) {
       let currKey = dataDictKeysArr[i];
       let currKeyData = dataDict[currKey];
       let sum = 0.0;

       for (let j = 0; j < currKeyData.length; j++) {
           sum += currKeyData[j];
       }

       let avg = sum / currKeyData.length;
       dataDict[currKey] = parseFloat(avg.toFixed(2));
    }
    return dataDict;
}
