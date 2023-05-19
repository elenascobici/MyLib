/*
    Render the syllabus page, load the current syllabus table from 
    syllabustable.txt and update the file with any changes from the user.
*/

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
    SaveTable();
})

function CreateTableRow(taskName, dueDate, taskType, taskStatus) {
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

function CreateTask() {
    var taskName = document.getElementById("taskname").value;
    var dueDate = document.getElementById("duedate").value;
    var taskType = document.getElementById("typebutton").innerHTML;
    var taskStatus = document.getElementById("statusbutton").innerHTML;

    CreateTableRow(taskName, dueDate, taskType, taskStatus);

    SaveTable();
}

function SaveTable() {
    var tableData = "";
    var syllTable = document.getElementById("syllabustable");
    for (var i = 1; i < syllTable.rows.length; i++) {
        var row = syllTable.rows[i];
        for (var j = 0; j < row.cells.length - 1; j++) {
            tableData += row.cells[j].innerHTML + ",";
        }  
    }
    UpdateValue('<table>', tableData, 'syllabustable.txt');
}

function LoadTable(tableData) {
    var tempTableData = tableData;
    var numColumns = document.getElementById("syllabustable").rows[0].cells.length - 1; // subtract 1 to not include x button
    while (tempTableData.length > 0) {
        var tdts = []; // task, date, type, status
        for (i = 0; i < numColumns; i++) {
            var nextComma = tempTableData.indexOf(',');
            tdts.push(tempTableData.substring(0, nextComma));
            tempTableData = tempTableData.substring(nextComma + 1);
        }
        CreateTableRow(tdts[0], tdts[1], tdts[2], tdts[3]);
    }
}

window.onload = function() {
    console.log('syllabus running');
    var filepaths = [path.join(__dirname, 'info.txt'), path.join(__dirname, 'syllabustable.txt')];

    filepaths.forEach(path => fs.readFile(path, 'utf-8', (err, data) => 
    {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        ParseFileContent(data);
    }));
    

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
        // Process the value read
        if (tagName == "colorsetting") {
            ColorSettings(tagValue);
        }
        else if (tagName == "table") {
            LoadTable(tagValue);
        }
    }
}