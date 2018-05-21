
var dropDown = document.getElementById("selDataset");
var pieChart = document.getElementById("piechart");

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
        let otu_ids = response[0]["otu_ids"].slice(0, 10);
        let sample_values = response[1]["sample_values"].slice(0, 10);
        data["otu_ids"] = otu_ids;
        data["sample_values"] = sample_values;

        Plotly.d3.json("/metadata/" + name, (err, res) => {
            data["metadata"] = res;

            updateMetadata(data["metadata"]);
            updatePie(data);
        });
    });
}

// the only function of this 
function updatePie(data){
    console.log(data);
    Plotly.restyle(pieChart, "values", [data["sample_values"]] );
    Plotly.restyle(pieChart, "labels", [data["otu_ids"]] );
    console.log("Upated");
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

// initializing pie chart with random data
function initPie(){
    console.log("init pie");
    let layout = {
        height: 400,
        width: 500
      };
    let data = [{ values: [1, 2, 3], type: 'pie'}];
    Plotly.plot(pieChart, data, layout);
    getSampleData("BB_940");
}

// calls the functions in order
function main(){
    initNames();
    initPie();
}

main();