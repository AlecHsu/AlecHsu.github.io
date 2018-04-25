function readDataFromCsv(dataColArr, state) {
    let dataDict = {};
    d3.csv("state_crime.csv", function(error, data) {

      if (error) throw error;

      if (state != "National") {
          data = data.filter(d => d["State"] == state);
      }

      data.forEach(function(d) {
          let colName = "";

          if (d.Year in dataDict){

              for (let i = 0; i < dataColArr.length; i++) {
                  colName = dataColArr[i];
                  dataDict[d.Year][i].push(+d[colName]);
              }
          }else{
              let colArr = [];
              for (let i = 0; i < dataColArr.length; i++) {
                  colName = dataColArr[i];
                  colArr.push([+d[colName]]);
              }
              dataDict[d.Year] = colArr;
          }

      });

      let yearsArr = d3.keys(dataDict);
      console.log(d3.values(dataDict).length);

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
              dataDict[year][j] = avg.toFixed(2);
          }
      }
    });
    console.log("=====================");
    console.log(d3.values(dataDict).length);
    return dataDict;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function drawChart(dataDict, dataColArr) {
    // let chartTitle = "Trend of Average Crime Rate in United States in Years";
    let chartTitle = "";
    let yAxisTitle = "# of Reported Offenses per 100,000 Population";

    // create data set on our data
    var dataSet = anychart.data.set(getData(dataDict));

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
}

function getData(dataDict) {
    // console.log(d3.values(dataDict).length);
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

function addState(stateSet, dataColArr) {
    let stateArr = Array.from(stateSet);
    let stateName = null;
    let htmlStr = null;

    for (let i = 0; i < stateArr.length; i++) {
        stateName = stateArr[i];
        htmlStr = `<a class="dropdown-item" href="#">${stateName}</a>`;
        $( ".states_dropdown" ).append(htmlStr);
    }

    $('.states_dropdown a').on('click', function(){
      // $('#datebox').val($(this).text());
      $( "#container" ).empty();
      main($(this).text());
      // let dataDict = readDataFromCsv(dataColArr, $(this).text());
      // anychart.onDocumentLoad(function() {
      //     drawChart(dataDict, dataColArr);
      // });
      // drawChart(dataDict, dataColArr);
    });
}

function makeStateDropdown(fileName, dataColArr) {
    d3.csv(fileName, function(error, data) {
        let stateSet = new Set();
        if (error) throw error;
        data.forEach(function(d) {
            stateSet.add(d.State);
        });
        addState(stateSet, dataColArr);
    });
}

function main(state) {
    let fileName = "state_crime.csv"
    let dataColArr = [
        "Rates.Property.Burglary",
        "Rates.Property.Larceny",
        "Rates.Property.Motor",
        "Rates.Violent.Assault",
        "Rates.Violent.Murder",
        "Rates.Violent.Rape",
        "Rates.Violent.Robbery"
    ];

    // let dataDict = readDataFromCsv(dataColArr, "National");

    let dataDict = {};
    d3.csv("state_crime.csv", function(error, data) {

      if (error) throw error;

      if (state != "National") {
          data = data.filter(d => d["State"] == state);
      }

      data.forEach(function(d) {
          let colName = "";

          if (d.Year in dataDict){

              for (let i = 0; i < dataColArr.length; i++) {
                  colName = dataColArr[i];
                  dataDict[d.Year][i].push(+d[colName]);
              }
          }else{
              let colArr = [];
              for (let i = 0; i < dataColArr.length; i++) {
                  colName = dataColArr[i];
                  colArr.push([+d[colName]]);
              }
              dataDict[d.Year] = colArr;
          }

      });

      let yearsArr = d3.keys(dataDict);
      // console.log(d3.values(dataDict).length);

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
              dataDict[year][j] = avg.toFixed(2);
          }
      }
    });
    // console.log("=====================");
    // console.log(d3.values(dataDict).length);

    anychart.onDocumentLoad(function() {
        // let dataDict = readDataFromCsv(dataColArr, "National");
        makeStateDropdown(fileName, dataColArr);
        drawChart(dataDict, dataColArr);
    });
    console.log(state);
    if (state != "National") {
        makeStateDropdown(fileName, dataColArr);
        drawChart(dataDict, dataColArr);
        console.log("draw again");
    }
}

main("National");
