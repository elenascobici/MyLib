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
const classInput = document.getElementById('class-button');
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
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
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
// Add event listeners for mouse entering and leaving dropdown menu.
Array.from(document.querySelectorAll('.dropdown')).forEach((element) => {
    const contentStyle = element.querySelector('.dropdown-content').style;
    element.addEventListener('mouseover', function () {
        contentStyle.display = 'block';
    });
    element.addEventListener('mouseleave', function () {
        contentStyle.display = 'none';
    });
});
// Load the table from the user data.
function LoadTable() {
    data.syllabus.table.forEach((row) => {
        new Task(row.name, row.type, row.class, row.due, row.planned, row.status, row.phases);
    });
}
// Populate the dropdown list of classes from the user's json data.
function PopulateClasses() {
    data.syllabus.classes.forEach((className) => {
        const classOption = document.createElement('a');
        classOption.classList.add('dropdown-option');
        classOption.innerHTML = className;
        document.getElementById('class-content').insertBefore(classOption, document.getElementById('add-class'));
    });
}
let oldClassName;
// 
function EditDropdownOption(e) {
    const target = e.target;
    const newClass = document.createElement('input');
    newClass.classList.add('dropdown-option');
    newClass.classList.add('textinput');
    oldClassName = target.innerHTML;
    newClass.value = oldClassName;
    newClass.addEventListener('focus', function ListenForKeyPress() {
        newClass.addEventListener('keypress', EditClassOption);
        newClass.addEventListener('focusout', function () {
            newClass.removeEventListener('keypress', EditClassOption);
        });
    });
    document.getElementById('class-content').replaceChild(newClass, target);
}
// Helper event listener for editing a class option if the user hits the enter
// key while editing a class input.
function EditClassOption(e) {
    if (e.key === 'Enter') {
        const target = e.target;
        const newClassName = target.value;
        const newClassOption = document.createElement('a');
        newClassOption.classList.add('dropdown-option');
        newClassOption.addEventListener('click', DropdownOptionClick);
        newClassOption.addEventListener('contextmenu', EditDropdownOption);
        newClassOption.innerHTML = newClassName;
        document.getElementById('class-content').replaceChild(newClassOption, target);
        // If the edited class name is selected, change the selected option text.
        const classDropdown = document.getElementById('class-button');
        if (classDropdown.innerHTML == oldClassName) {
            classDropdown.innerHTML = newClassName;
        }
        // Replace the class name in data.syllabus.classes.
        const classArray = data.syllabus.classes;
        classArray.splice(classArray.indexOf(oldClassName));
        classArray.push(newClassName);
        // Replace the class name in every existing task.
        let rowIndex = 1;
        data.syllabus.table.forEach((task) => {
            if (task.class == oldClassName) {
                task.class = newClassName;
                document.getElementById('syllabus-table').rows[rowIndex].cells[2].innerHTML =
                    newClassName;
            }
            rowIndex++;
        });
        GenericMethods.UpdateUserData();
    }
}
// Helper event listener method for creating a new class option if the user
// hits the enter key while focusing on a class input.
function CreateClassOption(e) {
    if (e.key === 'Enter') {
        const target = e.target;
        const newClassName = target.value;
        // Don't allow empty class names.
        if (newClassName === '') {
            document.getElementById('class-content').removeChild(target);
            return;
        }
        const newClassOption = document.createElement('a');
        newClassOption.classList.add('dropdown-option');
        newClassOption.addEventListener('click', DropdownOptionClick);
        newClassOption.addEventListener('contextmenu', EditDropdownOption);
        newClassOption.innerHTML = newClassName;
        document.getElementById('class-content').replaceChild(newClassOption, target);
        if (!data.syllabus.classes) {
            data.syllabus.classes = [];
        }
        data.syllabus.classes.push(newClassName);
        GenericMethods.UpdateUserData();
        target.removeEventListener('keypress', CreateClassOption);
    }
}
function DropdownOptionClick(e) {
    var selectedElement = e.currentTarget;
    if (selectedElement.id === 'add-class') {
        const newClass = document.createElement('input');
        newClass.classList.add('dropdown-option');
        newClass.classList.add('textinput');
        newClass.addEventListener('focus', function ListenForKeyPress() {
            newClass.addEventListener('keypress', CreateClassOption);
            newClass.addEventListener('focusout', function () {
                newClass.removeEventListener('keypress', CreateClassOption);
            });
        });
        document.getElementById('class-content').insertBefore(newClass, document.getElementById('add-class'));
    }
    else {
        selectedElement.parentElement.parentElement
            .getElementsByClassName('dropbtn')[0]
            .innerHTML = selectedElement.innerHTML;
        selectedElement.parentElement.style.display = 'none';
    }
}
window.onload = function () {
    LoadTable();
    // Open the modal for editing when a row is clicked.
    Array.from(document.getElementsByClassName('syllabus-table-row'))
        .forEach(row => {
        row.addEventListener('click', rowClicked);
    });
    PopulateClasses();
    document.querySelectorAll('.dropdown-option').forEach(option => {
        option.addEventListener('click', DropdownOptionClick);
        option.addEventListener('contextmenu', EditDropdownOption);
    });
    SyllabusGenericMethods.ColorSettings(data.main.colorsetting);
};
