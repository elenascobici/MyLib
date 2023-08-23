/*
    Render the syllabus page, load the current syllabus table and update the 
    user data JSON file with any changes from the user.
*/

const Task = require('./task-class.js');
const UserData = require('./user-data-interface');
const SyllabusGenericMethods = require('./generic-methods');
const data = SyllabusGenericMethods.GetUserData();

const e = require('electron');
var remote = require('electron').remote;
const url = require('url');
var fs = require('fs');
const p = require('path');

// Create event listener for type dropdown being used
const types = document.querySelectorAll('.typedropdownoption');
types.forEach(type => {
    type.addEventListener('click', SetTypeDropDown);
});

// Create event listener for status dropdown being used
const statuses = document.querySelectorAll('.statusdropdownoption');
statuses.forEach(status => {
    status.addEventListener('click', SetStatusDropDown);
});

// Add event listeners for creating tasks and phases

function SetTypeDropDown(e: Event) {
    var selected = (e.currentTarget! as HTMLElement).innerHTML;
    document.getElementById("typebutton")!.innerHTML = selected;
}

function SetStatusDropDown(e: Event) {
    var selected = (e.currentTarget! as HTMLElement).innerHTML;
    document.getElementById("statusbutton")!.innerHTML = selected;
}

// Load the table from the user data.
function LoadTable() {
    data.syllabus.table.forEach((row: typeof Task) => {
        const task = new Task(row.name, row.type, row.class, row.due,
            row.planned, row.status, row.phases);
    })
}

// When the syllabus window loads, add event listeners to all buttons.
window.onload = function() {
    LoadTable();
    SyllabusGenericMethods.ColorSettings(data.main.colorsetting);

    const modal = document.getElementById("taskmodal")!;
    const taskNameInput: HTMLInputElement = document
        .getElementById('taskname')! as HTMLInputElement;
    const typeInput = document.getElementById('typebutton')!;
    const classInput = document.getElementById('classbutton')!; 
    const dueDateInput: HTMLInputElement = document
        .getElementById('duedate')! as HTMLInputElement;
    const plannedDateInput: HTMLInputElement = document
        .getElementById('planneddate')! as HTMLInputElement;
    const statusInput = document.getElementById('statusbutton')!;
    const createButton = document.getElementById('createtaskbutton')!;
    const closeButton = document.getElementById('closemodal')!;

    // When the add button is clicked, display the task modal and reset its
    // inputs.
    document.getElementById('add')!.addEventListener('click', function() {
        taskNameInput.value = '';
        typeInput.innerHTML = 'Select Type';
        classInput.innerHTML = 'Select Class';
        dueDateInput.value = '';
        plannedDateInput.value = '';
        statusInput.innerHTML = 'Select Status';
        modal.style.display = "block";
    });

    createButton.onclick = function() {
        const task = new Task(taskNameInput.value, typeInput.innerHTML, 
            classInput.innerHTML, dueDateInput.value, plannedDateInput.value,
            statusInput.innerHTML);
        data.syllabus.table.push(task);
        SyllabusGenericMethods.UpdateUserData();
    }
    
    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}