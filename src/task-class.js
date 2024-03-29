"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.rowToTask = void 0;
/*
    Define the Task class, which represents the data stored in a single row.
*/
const GenericMethods = require('./generic-methods');
exports.rowToTask = new Map();
class Task {
    constructor(name, type, taskClass, due, planned, status, phases) {
        this.name = name;
        this.type = type;
        this.class = taskClass;
        this.due = due;
        this.planned = planned;
        this.status = status;
        this.phases = phases;
        this.row = document.getElementById('syllabus-table').insertRow(-1);
        this.row.classList.add('syllabus-table-row');
        this.PopulateRow();
        exports.rowToTask.set(this.row, this);
    }
    // Add all cells to the row corresponding to this task.
    PopulateRow() {
        [this.name, this.type, this.class, this.due, this.planned,
            this.status, this.GetProgress(), 'x']
            .forEach((cellValue) => {
            this.row.insertCell(-1).innerHTML = String(cellValue);
            this.row.lastChild.classList.add('visible');
        });
        this.CreateDeleteButton();
    }
    // Create a delete (x) button for this task's row and add all needed
    // event listeners.
    CreateDeleteButton() {
        const deleteButton = this.row.lastChild;
        deleteButton.classList.add('deletecolumn', 'deletecell');
        deleteButton.style.visibility = 'hidden';
        this.row.onmouseover = function (e) {
            deleteButton.style.visibility = 'visible';
        };
        this.row.onmouseleave = function (e) {
            deleteButton.style.visibility = 'hidden';
        };
        deleteButton.onclick = function () {
            this.row.remove();
            const syllabusTable = GenericMethods.GetUserData().syllabus
                .table;
            syllabusTable.splice(syllabusTable.indexOf(this), 1);
            GenericMethods.UpdateUserData();
        }.bind(this);
    }
    // Calculate and return the user's progress for this task using the phases.
    GetProgress() {
        if (!this.phases) { // No phases; progress is either 0% or 100%.
            return this.status === 'Finished' ? '100%' : '0%';
        }
        const weights = Array.from(this.phases, (p) => p.weight)
            .reduce((weightAcc, newWeight) => weightAcc + newWeight, 0);
        return String(weights * 100) + '%';
    }
    // Edit the task with the new values.
    EditTask(name, type, taskClass, due, planned, status, phases) {
        this.name = name;
        this.type = type;
        this.class = taskClass;
        this.due = due;
        this.planned = planned;
        this.status = status;
        this.phases = phases;
        while (this.row.cells.length > 0) {
            this.row.deleteCell(-1);
        }
        this.PopulateRow();
    }
}
exports.Task = Task;
class Phase {
    constructor(name, weight, status) {
        this.name = name;
        this.weight = weight;
        this.status = status;
    }
}
// export = Task;
