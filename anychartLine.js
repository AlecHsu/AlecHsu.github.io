let dataDict = {};
let dataColArr = [
    "Rates.Property.Burglary",
    "Rates.Property.Larceny",
    "Rates.Property.Motor",
    "Rates.Violent.Assault",
    "Rates.Violent.Murder",
    "Rates.Violent.Rape",
    "Rates.Violent.Robbery"
];

let chartTitle = "Trend of Crime Rate in United States";
let yAxisTitle = "Number of Reported Offenses per 100,000 Population";

anychart.onDocumentReady(function() {
    d3.csv("state_crime.csv", function(error, data) {

      if (error) throw error;

      data.forEach(function(d) {
          if (d.Year in dataDict){
              let colName = "";

              for (let i = 0; i < dataColArr.length; i++) {
                  colName = dataColArr[i];
                  // dataDict[d.Year][i].push(parseFloat(+d[colName]).toFixed(2));
                  // let val = (+d[colName]).toFixed(2);
                  // dataDict[d.Year][i].push(val);
                  dataDict[d.Year][i].push(+d[colName]);
              }
          }else{
              let colArr = [];
              let colName = "";

              for (let i = 0; i < dataColArr.length; i++) {
                  colName = dataColArr[i];
                  // colArr.push([parseFloat(+d[colName]).toFixed(2)]);
                  // let val = (+d[colName]).toFixed(2);
                  // colArr.push([val]);
                  colArr.push([+d[colName]]);
              }
              dataDict[d.Year] = colArr;
          }
      });

      let yearsArr = d3.keys(dataDict);

      for (let i = 0; i < yearsArr.length; i++) {
          let year = yearsArr[i];
          let yearData = dataDict[year];

          for (let j = 0; j < yearData.length; j++) {
              let colData = yearData[j];

              let sum = 0.0;
              for (let k = 0; k < colData.length; k++) {
                  sum += colData[k];
              }

              let avg = sum / colData.length;
              dataDict[year][j] = avg;
          }
      }
    });
});

anychart.onDocumentLoad(function() {
    // create data set on our data
    var dataSet = anychart.data.set(getData());

    let seriesDataArr = [];

    for (let i = 1; i <= dataColArr.length; i++) {
        let seriesData = dataSet.mapAs({
        'x': 0,
        'value': i
        });
        seriesDataArr.push(seriesData);
    }

    // create line chart
    var chart = anychart.line();

    // turn on chart animation
    chart.animation(true);

    // set chart padding
    chart.padding([10, 20, 5, 20]);

    // turn on the crosshair
    chart.crosshair()
    .enabled(true)
    .yLabel(false)
    .yStroke(null);

    // set tooltip mode to point
    chart.tooltip().positionMode('point');

    // set chart title text settings
    chart.title(chartTitle);

    // set yAxis title
    chart.yAxis().title(yAxisTitle);
    chart.xAxis().labels().padding(5);

    for (let i = 0; i < seriesDataArr.length; i++) {

        let series = chart.line(seriesDataArr[i]);

        let rawColName = dataColArr[i];
        let start_i = rawColName.lastIndexOf(".");

        series.name(rawColName.slice(start_i+1, rawColName.length));

        series.hovered().markers()
        .enabled(true)
        .type('circle')
        .size(4);

        series.tooltip()
        .position('right')
        .anchor('left-center')
        .offsetX(5)
        .offsetY(5);
    }

    // turn the legend on
    chart.legend()
    .enabled(true)
    .fontSize(13)
    .padding([0, 0, 10, 0]);

    // set container id for the chart
    chart.container('container');
    // initiate chart drawing
    chart.draw();
});

function getData() {
    let resultArr = [];
    let yearsArr = d3.keys(dataDict);
    for (let i = 0; i < yearsArr.length; i++) {
        let tmpArr = [];
        let year = yearsArr[i];
        tmpArr.push(year);

        let yearData = dataDict[year];
        for (let j = 0; j < yearData.length; j++) {
            tmpArr.push(yearData[j]);
        }
        resultArr.push(tmpArr);
    }
    return resultArr;
    // return [
    // ['1986', 3.6, 2.3, 2.8, 11.5],
    // ['1987', 7.1, 4.0, 4.1, 14.1],
    // ['1988', 8.5, 6.2, 5.1, 17.5],
    // ['1989', 9.2, 11.8, 6.5, 18.9]
    // ]
}
