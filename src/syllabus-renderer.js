"use strict";
/*
    Render the syllabus page, load the current syllabus table and update the
    user data JSON file with any changes from the user.
*/
const Task = require('./task-class.js').Task;
const rowToTask = require('./task-class.js').rowToTask;
const UserData = require('./user-data-interface');
const SyllabusGenericMethods = require('./generic-methods');
const data = SyllabusGenericMethods.GetUserData();
const e = require('electron');
var remote = require('electron').remote;
const url = require('url');
var fs = require('fs');
const p = require('path');
const modal = document.getElementById("taskmodal");
const taskNameInput = document
    .getElementById('taskname');
const typeInput = document.getElementById('typebutton');
const classInput = document.getElementById('classbutton');
const dueDateInput = document
    .getElementById('duedate');
const plannedDateInput = document
    .getElementById('planneddate');
const statusInput = document.getElementById('statusbutton');
const createButton = document.getElementById('createtaskbutton');
const closeButton = document.getElementById('closemodal');
let clickedTask = null;
let clickedRow;
const tableData = data.syllabus.table;
// When the add button is clicked, display the task modal and reset its
// inputs.
document.getElementById('add').addEventListener('click', function () {
    taskNameInput.value = '';
    typeInput.innerHTML = 'Select Type';
    classInput.innerHTML = 'Select Class';
    dueDateInput.value = '';
    plannedDateInput.value = '';
    statusInput.innerHTML = 'Select Status';
    createButton.innerHTML = 'Create';
    modal.style.display = "block";
});
// Create a new task and add it to the table or edit the task.
createButton.onclick = function () {
    if (createButton.innerHTML === 'Create') { // Create task.
        const task = new Task(taskNameInput.value, typeInput.innerHTML, classInput.innerHTML, dueDateInput.value, plannedDateInput.value, statusInput.innerHTML);
        tableData.push(task);
        task.row.addEventListener('click', rowClicked);
    }
    else { // Edit task.
        // Note: 1 must be subtracted from the row index to disregard the
        // header row.
        const tableIndex = clickedRow.rowIndex - 1;
        clickedTask.EditTask(taskNameInput.value, typeInput.innerHTML, classInput.innerHTML, dueDateInput.value, plannedDateInput.value, statusInput.innerHTML);
        tableData[tableIndex] = clickedTask;
    }
    SyllabusGenericMethods.UpdateUserData();
};
// Close the modal when either the close button or gray area around the
// modal are clicked.
closeButton.onclick = function () {
    modal.style.display = "none";
};
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
// Open the modal for editing when a row is clicked.
Array.from(document.getElementsByClassName('syllabus-table-row'))
    .forEach(row => {
    row.addEventListener('click', rowClicked);
});
function rowClicked(e) {
    const eventTarget = e.target;
    if (!eventTarget.classList.contains('deletecell')) {
        clickedRow = eventTarget.parentElement;
        clickedTask = rowToTask.get(clickedRow);
        taskNameInput.value = clickedTask.name;
        typeInput.innerHTML = clickedTask.type;
        classInput.innerHTML = clickedTask.class;
        dueDateInput.value = clickedTask.due;
        plannedDateInput.value = clickedTask.planned;
        statusInput.innerHTML = clickedTask.status;
        createButton.innerHTML = 'Edit';
        modal.style.display = "block";
    }
}
// Add event listener for mouse entering and leaving dropdown menu.
Array.from(document.querySelectorAll('.dropdown')).forEach((element) => {
    const contentStyle = element.querySelector('.dropdown-content').style;
    element.addEventListener('mouseover', function () {
        contentStyle.display = 'block';
    });
    element.addEventListener('mouseleave', function () {
        contentStyle.display = 'none';
    });
});
// Create event listener for dropdown option being clicked.
document.querySelectorAll('.dropdownoption').forEach(option => {
    option.addEventListener('click', (e) => {
        var selectedElement = e.currentTarget;
        selectedElement.parentElement.parentElement
            .getElementsByClassName('dropbtn')[0]
            .innerHTML = selectedElement.innerHTML;
        selectedElement.parentElement.style.display = 'none';
    });
});
// Load the table from the user data.
function LoadTable() {
    data.syllabus.table.forEach((row) => {
        new Task(row.name, row.type, row.class, row.due, row.planned, row.status, row.phases);
    });
}
window.onload = function () {
    LoadTable();
    SyllabusGenericMethods.ColorSettings(data.main.colorsetting);
};
