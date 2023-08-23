import Task = require("./task-class")

export interface UserData {
    main: {
        colorsetting: string,
        progressBars: typeof Task[]
    },
    syllabus: {
        table: typeof Task[],
        classes: string[]
    }
}