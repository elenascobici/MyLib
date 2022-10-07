var total = 100;
var currentVals = [];

const electron = require('electron');
var remote = require('electron').remote;
const url = require('url');
var fs = require('fs');
const path = require('path');

// document.getElementById("colorsetting").addEventListener("change", SetColor);
// document.getElementById("test").addEventListener("click", Test);

// document.getElementById("default").addEventListener("click", SetColor)
// document.getElementById("blue").addEventListener("click", SetColor)
// document.getElementById("pink").addEventListener("click", SetColor)

const colors = document.querySelectorAll('.color');
colors.forEach(color => {
    color.addEventListener('click', SetColor);
});

window.onload = function() {
    var filepath = path.join(__dirname, 'info.txt');

    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        ParseFileContent(data);

        for (let i = 1; i < currentVals.length + 1; i++) {
            var barname = "progressbar" + String(i);
            var messagename = "progressmessage" + String(i);
    
            var bar = document.getElementById(barname);
            var message = document.getElementById(messagename);
            UpdateProgress(bar, message, i);
        }
    });
}

// function SetColor() {
//     var dropdown = document.getElementById("colorsetting");
//     var color = dropdown.value;
//     ColorSettings(color);

//     UpdateValue('<colorsetting>', color);
// }

function SetColor() {
    var color = this.id;
    ColorSettings(color);
    UpdateValue('<colorsetting>', color);
}

function UpdateValue(tag, newVal) {
    var filepath = path.join(__dirname, 'info.txt');

    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        console.log(data);
        var tagIndex = data.indexOf(tag);
        console.log(tagIndex);
        var tempStr = data.slice(tagIndex);
        console.log(tempStr);
        tempStr = tempStr.slice(tempStr.indexOf('>') + 1);
        console.log(tempStr);
        var nextTagIndex = tempStr.indexOf('<');
        var newData = '';
        if (nextTagIndex == -1){
            newData = data.slice(0,tagIndex) + tag + newVal;
            console.log(newData);
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

function ParseFileContent(data) {
    var tempdata = data;
    while (tempdata.length > 0) {
        var endTagIndex = tempdata.indexOf('>');
        var tagName = tempdata.slice(1, endTagIndex);
        tempdata = tempdata.slice(endTagIndex + 1);
        var tagValue = '';
        var nextTag = tempdata.indexOf('<');
        if (nextTag == -1) {
            // In this case, there are no more tags
            tagValue = tempdata;
            tempdata = '';
        }
        else {
            // There are more tags to find
            tagValue = tempdata.slice(0, nextTag);
            tempdata = tempdata.slice(nextTag);
        }
        // Set proper variable value
        if (tagName.includes("current")) {
            // These tags' values have a name and then a completion percentage
            var nameVal = tagValue.split(';');
            currentVals.push(parseInt(nameVal[1]));
            CreateProgressBar(parseInt(tagName.slice(-1)), nameVal[0]);
        }
        else if (tagName == "colorsetting") {
            ColorSettings(tagValue);
            
        }
        else {
            console.log(tagName + " is an invalid tag.");
        }
    }
}

function CreateProgressBar(barIndex, taskTitle) {
    var newContainer = document.createElement("div");
    newContainer.id = "progress" + String(barIndex);
    newContainer.className = "progress";

    var horiz = document.createElement("hr");
    newContainer.appendChild(horiz);

    var taskName = document.createElement("p");
    var text = document.createTextNode(taskTitle)
    taskName.appendChild(text);
    newContainer.appendChild(taskName);

    var newBar = document.createElement("div");
    newBar.id = "progressbar" + String(barIndex);
    newBar.className = "progressbar";
    newContainer.appendChild(newBar);

    var newMessage = document.createElement("p");
    newMessage.id = "progressmessage" + String(barIndex);
    newMessage.className = "progressmessage";
    newContainer.appendChild(newMessage);

    var container = document.getElementById("second");
    container.appendChild(newContainer);
}

function UpdateProgress(bar, message, i) {
    var current = currentVals[i - 1];
    var needed_percent = Math.round((current / total) * 100);
    var timer = setInterval(MoveBar, 10);
    var width = 0;
    function MoveBar() {
        if (width >= needed_percent){
            clearInterval(timer);
            if (width == 100) {
                message.innerHTML = "You finished your goal! Great job!";
            }
            else if (width >= 80) {
                message.innerHTML = "You're so close!";
            }
            else if (width > 50) {
                message.innerHTML = "More than halfway there, nice!";
            }
            else if (width == 50) {
                message.innerHTML = "Halfway there!";
            }
            else if (width > 0) {
                message.innerHTML = "The first step is always the hardest!";
            }
            else {
                message.innerHTML = "Get started soon!";
            }
        }
        else {
            width++;
            bar.style.width = width + "%";
            bar.innerHTML = width + "%";
        }
    }
}

function ColorSettings(color) {
    let root = document.documentElement;
    if (color == "default") {
        root.style.setProperty('--lightest', '#ddcfe8');
        root.style.setProperty('--light', '#bc9bd6');
        root.style.setProperty('--middle', '#7f599d');
        root.style.setProperty('--dark', '#583970');
        root.style.setProperty('--darkest', '#362147');
    }
    else if (color == "blue") {
        root.style.setProperty('--lightest', '#bbd1ee');
        root.style.setProperty('--light', '#92afd4');
        root.style.setProperty('--middle', '#6a84a5');
        root.style.setProperty('--dark', '#43638f');
        root.style.setProperty('--darkest', '#284266');
    }
    else if (color == "pink") {
        root.style.setProperty('--lightest', '#ffe6fc');
        root.style.setProperty('--light', '#ebc5e6');
        root.style.setProperty('--middle', '#d09bc9');
        root.style.setProperty('--dark', '#af75a7');
        root.style.setProperty('--darkest', '#82487b');
    }
    else if (color == "peach") {
        root.style.setProperty('--lightest', '#ffdad5');
        root.style.setProperty('--light', '#f3beb7');
        root.style.setProperty('--middle', '#df9f96');
        root.style.setProperty('--dark', '#be766c');
        root.style.setProperty('--darkest', '#8c463c');
    }
    else if (color == "green") {
        root.style.setProperty('--lightest', '#b3ceb3');
        root.style.setProperty('--light', '#9cc49c');
        root.style.setProperty('--middle', '#7daf7d');
        root.style.setProperty('--dark', '#5e935e');
        root.style.setProperty('--darkest', '#396239');
    }
    else if (color == "gray") {
        root.style.setProperty('--lightest', '#d1d1d1');
        root.style.setProperty('--light', '#acacac');
        root.style.setProperty('--middle', '#888888');
        root.style.setProperty('--dark', '#5a5a5a');
        root.style.setProperty('--darkest', '#3e3e3e');
    }
    else if (color == "darkmode") {
        root.style.setProperty('--lightest', '#3e3e3e');
        root.style.setProperty('--light', '#5a5a5a');
        root.style.setProperty('--middle', '#888888');
        root.style.setProperty('--dark', '#acacac');
        root.style.setProperty('--darkest', '#d1d1d1');
    }
    else {
        console.log("Invalid color");
    }
}