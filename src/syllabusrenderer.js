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

const types = document.querySelectorAll('.typedropdownoption');
types.forEach(type => {
    type.addEventListener('click', SetTypeDropDown);
});

const statuses = document.querySelectorAll('.statusdropdownoption');
statuses.forEach(status => {
    status.addEventListener('click', SetStatusDropDown);
});

const edittypes = document.querySelectorAll('.edittypedropdownoption');
edittypes.forEach(type => {
    type.addEventListener('click', SetEditTypeDropDown);
});

const editstatuses = document.querySelectorAll('.editstatusdropdownoption');
editstatuses.forEach(status => {
    status.addEventListener('click', SetEditStatusDropDown);
});

document.getElementById("createtaskbutton").addEventListener('click', CreateTask);
document.getElementById('addphases').addEventListener('click', AddPhases);

function SetTypeDropDown() {
    var selected = this.innerHTML;
    document.getElementById("typebutton").innerHTML = selected;
}

function SetStatusDropDown() {
    var selected = this.innerHTML;
    document.getElementById("statusbutton").innerHTML = selected;
}

function SetEditTypeDropDown() {
    var selected = this.innerHTML;
    document.getElementById("edittypebutton").innerHTML = selected;
}

function SetEditStatusDropDown() {
    var selected = this.innerHTML;
    document.getElementById("editstatusbutton").innerHTML = selected;
}

function AddPhases() {
    var modal = document.getElementById('edittaskmodalcontent');
    var newPhase = document.createElement('input');
    newPhase.className = "textinput";
    modal.appendChild(document.createElement('br'));
    modal.appendChild(document.createElement('br'));
    var newPhaseLabel = document.createElement('label');
    newPhaseLabel.innerHTML = "New Phase: ";
    modal.appendChild(newPhaseLabel);
    modal.appendChild(newPhase);
}

var currRow = 1;

document.getElementById('updatetaskbutton').addEventListener('click', function UpdateTask() {
    var table = document.getElementById("syllabustable");
    table.rows[currRow].cells[0].innerHTML = document.getElementById('edittaskname').value;
    table.rows[currRow].cells[1].innerHTML = document.getElementById('editduedate').value;
    table.rows[currRow].cells[2].innerHTML = document.getElementById('edittypebutton').innerHTML;
    table.rows[currRow].cells[3].innerHTML = document.getElementById('editstatusbutton').innerHTML;
})

function CreateTask() {
    var taskName = document.getElementById("taskname").value;
    var dueDate = document.getElementById("duedate").value;
    var taskType = document.getElementById("typebutton").innerHTML;
    var taskStatus = document.getElementById("statusbutton").innerHTML;

    var table = document.getElementById("syllabustable");
    var newRow = table.insertRow(-1);
    var taskCell = newRow.insertCell(0);
    var dateCell = newRow.insertCell(1);
    var typeCell = newRow.insertCell(2);
    var statusCell = newRow.insertCell(3);
    var deleteCell = newRow.insertCell(4);
    deleteCell.style.border = 'none';
    deleteCell.style.outline = 'none';

    taskCell.innerHTML = taskName;
    taskCell.className = 'visible';
    dateCell.innerHTML = String(dueDate);
    dateCell.className = 'visible';
    typeCell.innerHTML = taskType;
    typeCell.className = 'visible';
    statusCell.innerHTML = taskStatus;
    statusCell.className = 'visible';
    deleteCell.innerHTML = 'x';
    deleteCell.style.visibility = 'hidden';
    deleteCell.className = 'deletecolumn deletecell';


    newRow.addEventListener('mouseover', function handleMouseOver() {
        deleteCell.style.visibility = 'visible';
    })
    newRow.addEventListener('mouseout', function handleMouseOut() {
        deleteCell.style.visibility = 'hidden';
    })

    deleteCell.addEventListener('click', function deleteCellClickHandler() {
        var rowIndex = deleteCell.parentElement.rowIndex;
        table.deleteRow(rowIndex);
    })

    var allVis = document.querySelectorAll(".visible");
    allVis.forEach(currCell => {
        currCell.addEventListener('click', function OpenTaskPage() {
            var rowIndex = currCell.parentElement.rowIndex;
            var editmodal = document.getElementById('edittaskmodal');
            var nameInput = document.getElementById('edittaskname');
            var dateInput = document.getElementById('editduedate');
            var typeInput = document.getElementById('edittypebutton');
            var statusInput = document.getElementById('editstatusbutton');
            currRow = rowIndex;

            var nameVal = table.rows[rowIndex].cells[0].innerHTML;
            var dateVal = table.rows[rowIndex].cells[1].innerHTML;
            var typeVal = table.rows[rowIndex].cells[2].innerHTML;
            var statusVal = table.rows[rowIndex].cells[3].innerHTML;

            nameInput.value = nameVal;
            dateInput.value = dateVal;
            typeInput.innerHTML = typeVal;
            statusInput.innerHTML = statusVal;

            editmodal.style.display = "block";

            var close = document.getElementById('editclosemodal');
            close.onclick = function() {
                editmodal.style.display = "none";
            }
        })
    })

    SaveTable();
}

function SaveTable() {
    var tableData = "<table>";
    var syllTable = document.getElementById("syllabustable");
    for (var i = 0, row; row = syllTable.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            tableData += col + ",";
        }  
    }
    UpdateValue('<table>', tableData, 'syllabustable.txt');
}

window.onload = function() {
    console.log('running');
    var filepath = path.join(__dirname, 'info.txt');

    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        ParseFileContent(data);
    });

    var modal = document.getElementById("taskmodal");
    var editmodal = document.getElementById("edittaskmodal");

    document.getElementById("add").onclick = function() {
        document.getElementById('taskname').value = '';
        document.getElementById('duedate').value = '';
        document.getElementById('typebutton').innerHTML = 'Select Type';
        document.getElementById('statusbutton').innerHTML = 'Select Status';
        modal.style.display = "block";
    }
    
    closemodal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        else if (event.target == editmodal) {
            editmodal.style.display = "none";
        }
    }
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
        if (tagName == "colorsetting") {
            ColorSettings(tagValue);
        }
    }
}

// Try to figure out how to import this from renderer.js instead of copying
function ColorSettings(color) {
    let root = document.documentElement;
    root.style.setProperty('--lightest', colorDict[color][0]);
    root.style.setProperty('--light', colorDict[color][1]);
    root.style.setProperty('--middle', colorDict[color][2]);
    root.style.setProperty('--dark', colorDict[color][3]);
    root.style.setProperty('--darkest', colorDict[color][4]);
}