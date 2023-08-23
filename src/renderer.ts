/*
    Render the home page, allow user to navigate to other pages and 
    load / save their settings.
*/
// const UserData = require('./user-data-interface');
// const Task = require('./task-class.js');
const GenericMethods = require('./generic-methods');

// const e = require('electron');
var remote = require('electron').remote;
const u = require('url');
var fs = require('fs');
// const p = require('path');

let userData: typeof UserData = GenericMethods.GetUserData();

// For each color in the color options dropdown, add an event listener for
// switching the color settings appropriately.
const colors = document.querySelectorAll('.color');
colors.forEach(color => {
    color.addEventListener('click', SetColor);
});

// When the home page loads, load all needed data from userdata.json and 
// display accordingly.
window.onload = function() {
    try {
        ParseUserData();
    } catch(e) {
        console.error(e);
    }
}

// Handle color option being clicked.
function SetColor(e: Event) {
    var color = (e.target! as HTMLElement).id;
    GenericMethods.ColorSettings(color);
    userData.main.colorsetting = color;
    GenericMethods.UpdateUserData();
}

// Parse the provided JSON object of user data.
function ParseUserData() {
    GenericMethods.SetUserData(userData);
    GenericMethods.ColorSettings(userData.main.colorsetting);
    userData.main.progressBars.forEach((bar: typeof Task) => CreateProgressBar(bar));
}

// Create and display a progress bar representing the user's progress on
// the task corresponding to taskTitle and of index barIndex.
function CreateProgressBar(task: typeof Task) {
    var newContainer = document.createElement("div");
    newContainer.className = "progress";

    var horiz = document.createElement("hr");
    newContainer.appendChild(horiz);

    var taskName = document.createElement("p");
    var text = document.createTextNode(task.name)
    taskName.appendChild(text);
    newContainer.appendChild(taskName);

    var newBar = document.createElement("div");
    newBar.className = "progressbar";
    newContainer.appendChild(newBar);

    var newMessage = document.createElement("p");
    newMessage.className = "progressmessage";
    newContainer.appendChild(newMessage);

    var container = document.getElementById("second");
    container!.appendChild(newContainer);
}

// Visually update the progress bar, bar, as well as its footnote,
// message. The index of the bar is i. 
// function UpdateProgress(bar, message, i) {
//     var current = currentVals[i - 1];
//     var needed_percent = Math.round((current / total) * 100);
//     var timer = setInterval(MoveBar, 10); // use a timer to move the bar until the needed value is reached
//     var width = 0;
//     function MoveBar() {
//         if (width >= needed_percent){ // we have reached the needed value; stop the timer and display the message
//             clearInterval(timer);
//             if (width == 100) {
//                 message.innerHTML = "You finished your goal! Great job!";
//             }
//             else if (width >= 80) {
//                 message.innerHTML = "You're so close!";
//             }
//             else if (width > 50) {
//                 message.innerHTML = "More than halfway there, nice!";
//             }
//             else if (width == 50) {
//                 message.innerHTML = "Halfway there!";
//             }
//             else if (width > 0) {
//                 message.innerHTML = "The first step is always the hardest!";
//             }
//             else {
//                 message.innerHTML = "Get started soon!";
//             }
//         }
//         else { // needed value has not been reached; continue to increment the width
//             width++;
//             bar.style.width = width + "%";
//             bar.innerHTML = width + "%";
//         }
//     }
// }