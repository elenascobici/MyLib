/*
    Render the home page, allow user to navigate to other pages and 
    load / save their settings.
*/

var currentVals = [];
var total = 100;

const electron = require('electron');
var remote = require('electron').remote;
const url = require('url');
var fs = require('fs');
const path = require('path');

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

function SetColor() {
    var color = this.id;
    ColorSettings(color);
    UpdateValue('<colorsetting>', color, 'info.txt');
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