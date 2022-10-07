const electron = require('electron');
var remote = require('electron').remote;
const url = require('url');
var fs = require('fs');
const path = require('path');

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
    var modal = document.getElementById('edittaskmodal');
    var newPhase = document.createElement('input');
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
            if (tagValue != "default") {
                ColorSettings(tagValue);
            }
        }
    }
}

// Try to figure out how to import this from renderer.js instead of copying
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