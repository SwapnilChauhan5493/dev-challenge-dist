/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library

global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const midPriceData = {
  "usdjpy": new Array(),
  "eurcad": new Array(),
  "gbpchf": new Array(),
  "gbpusd": new Array(),
  "gbpeur": new Array(),
  "eurchf": new Array(),
  "gbpaud": new Array(),
  "usdeur": new Array(),
  "euraud": new Array(),
  "gbpcad": new Array(),
  "gbpjpy": new Array()
}
const client = Stomp.client(url)
client.debug = function (msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

function connectCallback() {
  var data;
  client.subscribe("/fx/prices", (message) => {
    data = JSON.parse(message.body)
    displayTableData(data)
  });
}

client.connect({}, connectCallback, function (error) {
  alert(error.headers.message)
})

function displayTableData(data) {
  var table = document.getElementById("displayTable")
  var dataInArray = Object.keys(data).map((e) => data[e])
  var rowExists = false

  var sparkLineData = createSparkLineData(data)

  //Check if row already exists and update the values
  for (let i = 0; i < table.rows.length; i++) {
    let rowNum = table.rows[i]
    if (rowNum.cells[0].innerHTML === dataInArray[0]) {
      rowExists = true
      rowNum.cells[1].innerHTML = dataInArray[1]
      rowNum.cells[2].innerHTML = dataInArray[2]
      rowNum.cells[3].innerHTML = dataInArray[5]
      rowNum.cells[4].innerHTML = dataInArray[6]
      rowNum.cells[5].innerHTML = "<span id='sparkline-1' class='sparkline'></span>"
    }
  }

  if (!rowExists) {
    var row = table.insertRow(table.rows.length)
    var nameColumn = row.insertCell(0)
    var bestBidColumn = row.insertCell(1)
    var bestAskColumn = row.insertCell(2)
    var lastChangedBidCol = row.insertCell(3)
    var lastChangedAskCol = row.insertCell(4)
    var sparklineChart = row.insertCell(5)

    nameColumn.innerHTML = dataInArray[0]
    bestBidColumn.innerHTML = dataInArray[1]
    bestAskColumn.innerHTML = dataInArray[2]
    lastChangedBidCol.innerHTML = dataInArray[5]
    lastChangedAskCol.innerHTML = dataInArray[6]
    sparklineChart.innerHTML = "<span id='sparkline-1' class='sparkline'></span>"
  }

  var elm = document.getElementById("sparkline-1");

  var sparkline = new Sparkline(elm, {
    lineColor: "#666",
    startColor: "orange",
    endColor: "blue",
    maxColor: "red",
    minColor: "green",
    width: 300
  });

  sparkline.draw(sparkLineData[dataInArray[0]]);
  sortTable()
}

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("displayTable");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].cells[3];
      y = rows[i + 1].cells[3];
      if (Number(x.innerHTML) > Number(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function createSparkLineData(data) {
  var dataInArray = Object.keys(data).map((e) => data[e]);
  var midPriceValue = (Number(dataInArray[1]) + Number(dataInArray[2])) / 2
  midPriceData[dataInArray[0]] !== undefined ? midPriceData[dataInArray[0]].push(midPriceValue) : null
  console.log(midPriceData)
  return midPriceData
}

const exampleSparkline = document.getElementById('example-sparkline')
Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])