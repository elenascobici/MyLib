const electron = require('electron');
var remote = require('electron').remote;
const url = require('url');
var fs = require('fs');
const path = require('path');

// Define the color dictionary, mapping each color option to its 5 color shades
var colorDict = {};
colorDict["default"] = ['#ddcfe8', '#bc9bd6', '#7f599d', '#583970', '#362147'];
colorDict["blue"] = ['#bbd1ee', '#92afd4', '#6a84a5', '#43638f', '#284266'];
colorDict["pink"] = ['#ffe6fc', '#ebc5e6', '#d09bc9', '#af75a7', '#82487b'];
colorDict["peach"] = ['#ffdad5', '#f3beb7', '#df9f96', '#be766c', '#8c463c'];
colorDict["green"] = ['#b3ceb3', '#9cc49c', '#7daf7d', '#5e935e', '#396239'];
colorDict["gray"] = ['#d1d1d1', '#acacac', '#888888', '#5a5a5a', '#3e3e3e'];
colorDict["darkmode"] = ['#3e3e3e', '#5a5a5a', '#888888', '#acacac', '#d1d1d1'];

function UpdateValue(tag, newVal, fileName) {
    var filepath = path.join(__dirname, fileName);

    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        var tagIndex = data.indexOf(tag);
        var tempStr = data.slice(tagIndex);
        tempStr = tempStr.slice(tempStr.indexOf('>') + 1);
        var nextTagIndex = tempStr.indexOf('<');
        var newData = '';
        if (nextTagIndex == -1){
            newData = data.slice(0,tagIndex) + tag + newVal;
        }
        else {
            newData = data.slice(0,tagIndex) + tag + newVal + data.slice(nextTagIndex);
        }

        fs.writeFile(filepath, newData, (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    });
}

function ColorSettings (color) {
    let root = document.documentElement;
    root.style.setProperty('--lightest', colorDict[color][0]);
    root.style.setProperty('--light', colorDict[color][1]);
    root.style.setProperty('--middle', colorDict[color][2]);
    root.style.setProperty('--dark', colorDict[color][3]);
    root.style.setProperty('--darkest', colorDict[color][4]);
}