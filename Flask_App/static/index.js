
var dropDown = document.getElementById("selDataset");
var pie_chart = document.getElementById("piechart");

var names;
// gets data from api and populates names variable
function initNames() {
    /* data route */
    var url = "/names";
    Plotly.d3.json(url, function (error, response) {
        // console.log(error);
        // console.log(response);

        names = response;
        console.log("names: " + names)
        populateDropDown();

    });
}

// called after getting the data ( initNames function )
function populateDropDown(){
    console.log(names)
    for(i in names){
        name = names[i]
        var option = document.createElement("option");
        option.setAttribute('value', name);
        option.textContent = name;
        dropDown.appendChild(option);
    }
} 

function optionChanged(){}

// calls the functions in order
function main(){
    initNames();
}
// Creating Pie Chart using data from `/samples/<sample> and `/otu` data

var samplevalues;
function initsamplevalues() {
    /* data route */
    var url = "/samples/<sample>";
    Plotly.d3.json(url, function (error, response) {
        // console.log(error);
        // console.log(response);

        samplevalues = response;
        console.log("samplevalues: " + samplevalues)

    });
}

// calls the functions in order
function main(){
    initsamplevalues();
}

// // Sort the data array using the greekSearchResults value
// data.sort(function(a, b) {
//     return parseFloat(b.greekSearchResults) - parseFloat(a.greekSearchResults);
//   });
  
//   // Slice the first 10 objects for plotting
//   data = data.slice(0, 10);
  
//   // Reverse the array due to Plotly's defaults
//   data = data.reverse();
  
//   // Trace1 for the Greek Data
//   var trace1 = {
//     x: data.map(row => row.greekSearchResults),
//     y: data.map(row => row.greekName),
//     text: data.map(row => row.greekName),
//     name: "Greek",
//     type: "bar",
//     orientation: "h"
//   };
  
//   // data
//   var data = [trace1];
  
//   // Apply the group bar mode to the layout
//   var layout = {
//     title: "Greek gods search results",
//     margin: {
//       l: 100,
//       r: 100,
//       t: 100,
//       b: 100
//     }
//   };
  
//   // Render the plot to the div tag with id "plot"
//   Plotly.newPlot("plot", data, layout);
  



// main();
