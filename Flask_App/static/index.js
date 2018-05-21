
var dropDown = document.getElementById("selDataset");
var pieChart = document.getElementById("piechart");
var bubbleChart = document.getElementById('bubbleChart');
// holds the names in an array like [ BB_940 ] etc
var names = [];
// gets data from api and populates names variable
function initNames() {
    /* data route */
    var url = "/names";
    // carefull this is a async request
    Plotly.d3.json(url, function (error, response) {
        names = response;
        console.log("names: " + names)
        populateDropDown();
    });
}

// do not call before init Names
// because there would be no data to loop over
// TODO : There must be a better way to do it
// called after getting the data ( initNames function )
function populateDropDown(){
    for(i in names){
        name = names[i]
        var option = document.createElement("option");
        option.setAttribute('value', name);
        option.textContent = name;
        dropDown.appendChild(option);
    }
} 

// whenever user selects a new name
// from the drop down menu
function dropDownListener(name){
    console.log("Value changed to: " + name)
    getSampleData(name)
}

// function name is deceptive
// it does not return the data
// it simply calls the updatePie funciton
// with the data 
function getSampleData(name){
    let data = {}
    let url = "/samples/" + name;
    // careful this is a async req 
    // unfortunately i'm going into callback hell
    // forgive me javascript gods
    Plotly.d3.json(url, function (error, response) {
        // .slice cause we only care about the top 10 otus
        let otu_ids = response[0]["otu_ids"];
        let sample_values = response[1]["sample_values"];
        data["otu_ids"] = otu_ids;
        data["sample_values"] = sample_values;

        Plotly.d3.json("/metadata/" + name, (err, res) => {
            data["metadata"] = res;

            updateMetadata(data["metadata"]);
            updatePie(data);
            updateBubbleChart(data);
        });
    });
}

// the only function of this 
function updatePie(data){
    console.log(data);
    Plotly.restyle(pieChart, "values", [data["sample_values"].slice(0, 10)] );
    Plotly.restyle(pieChart, "labels", [data["otu_ids"].slice(0, 10)] );
    console.log("Upated");
}


function updateBubbleChart(data){
    console.log("updating bubble chart")
    Plotly.restyle(bubbleChart, 
        { 
            x: [data["otu_ids"]], 
            y: [data["sample_values"]],
            marker: {
                size: data["sample_values"],
                color: data["otu_ids"]
            }
        })
}

function updateMetadata(data){
    for(key in data){
        console.log(key);
        let x = document.getElementById("metadata_" + key);
        if(x){
            x.textContent = key + ": " + data[key];
        }
    }
}

function initBubbleChart(){
    let layout = {
        height: "100%",
        widht: "100%",
        title: 'OTU Markers',
    }
    var data = [{
        x: [1, 2, 3, 4],
        y: [10, 11, 12, 13],
        mode: 'markers',
        marker: {
            size: [40, 60, 80, 100]
        }
    }];
    Plotly.newPlot(bubbleChart, data, layout);
}

// initializing pie chart with random data
function initPie(){
    console.log("init pie");
    let layout = {
        height: 400,
        width: 500
      };
    let data = [{ values: [1, 2, 3], type: 'pie'}];
    Plotly.plot(pieChart, data, layout);
}

// calls the functions in order
function main(){
    initNames();
    initBubbleChart();
    initPie();
    getSampleData("BB_940");
}

main();