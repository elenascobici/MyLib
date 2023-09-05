/*
    Define the Task class, which represents the data stored in a single row.
*/
const GenericMethods = require('./generic-methods');

export const rowToTask: Map<HTMLTableRowElement, Task> = new
    Map<HTMLTableRowElement, Task>();

export class Task {
    name: string;
    type: string;
    class: string;
    due: Date;
    planned: Date;
    status: string;
    phases: Phase[];
    row?: HTMLTableRowElement;

    constructor(name: string, type: string, taskClass: string, due: Date, 
            planned: Date, status: string, phases: Phase[]) {
        this.name = name;
        this.type = type;
        this.class = taskClass;
        this.due = due;
        this.planned = planned;
        this.status = status;
        this.phases = phases;
        this.row = (document.getElementById('syllabus-table')! as 
            HTMLTableElement).insertRow(-1);
        this.row.classList.add('syllabus-table-row');
        this.PopulateRow();
        rowToTask.set(this.row, this);
    }

    // Add all cells to the row corresponding to this task.
    PopulateRow() {
        [this.name, this.type, this.class, this.due, this.planned, 
            this.status, this.GetProgress(), 'x']
                .forEach((cellValue: any) => 
            {
                this.row!.insertCell(-1).innerHTML = String(cellValue);
                (this.row!.lastChild! as HTMLElement).classList.add('visible');
            });
        this.CreateDeleteButton();
    }

    // Create a delete (x) button for this task's row and add all needed
    // event listeners.
    CreateDeleteButton() {
        const deleteButton: HTMLElement = this.row!.lastChild! as HTMLElement;
        deleteButton.classList.add('deletecolumn', 'deletecell');
        deleteButton.style.visibility = 'hidden';
        this.row!.onmouseover = function(e: Event) {
            deleteButton.style.visibility = 'visible';
        };
        this.row!.onmouseleave = function(e: Event) {
            deleteButton.style.visibility = 'hidden';
        };
        deleteButton.onclick = function (this: Task) {
            this.row!.remove();
            const syllabusTable: Task[] = GenericMethods.GetUserData().syllabus
                .table;
            syllabusTable.splice(syllabusTable.indexOf(this), 1);
            GenericMethods.UpdateUserData(); 
        }.bind(this);
    }

    // Calculate and return the user's progress for this task using the phases.
    GetProgress(): string {
        if (!this.phases) { // No phases; progress is either 0% or 100%.
            return this.status === 'Finished' ? '100%' : '0%';
        }
        const weights: number = Array.from(this.phases, (p: Phase) => p.weight)
            .reduce((weightAcc, newWeight) => weightAcc + newWeight, 0);
        return String(weights * 100) + '%';
    }

    // Edit the task with the new values.
    EditTask(name: string, type: string, taskClass: string, due: Date, 
            planned: Date, status: string, phases: Phase[]) {
        this.name = name;
        this.type = type;
        this.class = taskClass;
        this.due = due;
        this.planned = planned;
        this.status = status;
        this.phases = phases;
        while (this.row!.cells.length > 0) {
            this.row!.deleteCell(-1);
        }
        this.PopulateRow();
    }
}

class Phase {
    name: string;
    weight: number;
    status: boolean;
    constructor(name: string, weight: number, status: boolean) {
        this.name = name;
        this.weight = weight;
        this.status = status;
    }
}

// export = Task;