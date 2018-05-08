function drawPie(chartIdName, dataSet, stateName) {
  // create pie chart with passed data
  // var data = anychart.data.set([
  //   ['> USD 1 million', 69.2, 24.2],
  //   ['USD 100,000 to 1 million', 85, 334],
  //   ['USD 10,000 to 100,000', 32.1, 1045],
  //   ['< 10,000 USD', 8.2, 3038]
  // ]);
  let chartTitle = stateName;
  let data = anychart.data.set(dataSet);

  let wealth = data.mapAs({
    'x': 0,
    'value': 1
  });

  let chart = anychart.pie(wealth);
  chart.labels()
    // .hAlign('center')
    .position('outside');
    // .format('{%x} {%percent}%');
    // ({%PercentOfCategory}%)

  // set chart title text settings
  chart.title(chartTitle);

  // set legend title text settings
  chart.legend()
    // set legend position and items layout
    .position('center-bottom')
    .itemsLayout('horizontal')
    .align('center');

  // set container id for the chart
  chart.container(chartIdName);
  // initiate chart drawing
  chart.draw();
};

function updatePie(chartIdName, data, crime_type, nationalName, state_name, yearStr){
    $( "#"+chartIdName).empty();
    let anyChartDataSet = dataPreprocessingPie(data, crime_type, state_name, nationalName, yearStr);
    drawPie(chartIdName, anyChartDataSet, state_name);
}

function mainPie() {
    let crime_type = document.currentScript.getAttribute('crime_type');
    let fileName = "state_crime.csv";

    let nationalName = "National";
    let chartIdName = "containerPie";
    let defaultYear = "1994";

    d3.csv(fileName, function(error, data) {
        if (error) throw error;
        let anyChartDataSet = dataPreprocessingPie(data, crime_type, nationalName, nationalName, defaultYear);

        anychart.onDocumentLoad(function() {

            let stateName = null;
            let yearStr = null;

            drawPie(chartIdName, anyChartDataSet, nationalName);

            $('#svg_map path').on('click', function(){
                yearStr = $( "#slider" ).val();
                let state_id_name = $(this).attr("id");
                stateName = state_id_name.split("_")[1];
                updatePie(chartIdName, data, crime_type, nationalName, stateName, yearStr);
            });

            $('#slider').on("input", function() {
                yearStr = $(this).val();
                if (stateName == null){
                    updatePie(chartIdName, data, crime_type, nationalName, nationalName, yearStr);
                }else{
                    updatePie(chartIdName, data, crime_type, nationalName, stateName, yearStr);
                }
            });

        });
    });
}

function dataPreprocessingPie(data, crime_type, state, nationalName, yearStr) {
    let dataDict = {};
    let dataColArr = null;

    if (crime_type == "Violent"){
        dataColArr = [
            "Rates.Violent.Assault",
            "Rates.Violent.Murder",
            "Rates.Violent.Rape",
            "Rates.Violent.Robbery"
        ];
    }else{
        dataColArr = [
            "Rates.Property.Burglary",
            "Rates.Property.Larceny",
            "Rates.Property.Motor",
        ];
    }

    if (state != nationalName) {
        data = data.filter(d => d["State"] == state);
    }

    if (yearStr != "-1") {
        data = data.filter(d => d["Year"] == yearStr);
    }

    data.forEach(function(d) {
        let rawColName = null;
        let start_i = null;
        let colName = null;
        for (var i = 0; i < dataColArr.length; i++) {
            rawColName = dataColArr[i];
            start_i = rawColName.lastIndexOf(".");

            colName = rawColName.slice(start_i+1, rawColName.length);

            if (colName in dataDict){
                dataDict[colName].push(+d[rawColName])
            }else{
                dataDict[colName] = [+d[rawColName]];
            }
        }
    });

    let dataDictKeysArr = d3.keys(dataDict);
    let resultArr = [];

    for (let i = 0; i < dataDictKeysArr.length; i++) {
       let currKey = dataDictKeysArr[i];
       let currKeyData = dataDict[currKey];
       let sum = 0.0;

       for (let j = 0; j < currKeyData.length; j++) {
           sum += currKeyData[j];
       }

       let avg = sum / currKeyData.length;
       resultArr.push([currKey, parseFloat(avg.toFixed(2))])
    }
    return resultArr;
}

mainPie();
