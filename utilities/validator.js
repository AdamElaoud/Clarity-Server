const { validate } = require("jsonschema");

module.exports = {
    validateTask(req) {
        let result = validate(req, taskSchema);
        
        console.log(`Valid Structure: ${result.valid}`);

        if (!result.valid)
            throw "The provided JSON does not have a valid structure."
    },
    validateUser(req) {
        let result = validate(req, userSchema);
        
        console.log(`Valid Structure: ${result.valid}`);

        if (!result.valid)
            throw "The provided JSON does not have a valid structure."
    }
};

const userSchema = {
    title: "userSchema",
    description: "a new user to add to the database",
    type: "object",
    properties: {
        username: {
            description: "login username",
            type: "string"
        },
        displayname: {
            description: "display name",
            type: "string"
        },
        detoxday: {
            description: "detox day for the user",
            type: "string"
        }
    }
}

const taskSchema = {
    title: "taskSchema",
    description: "a completed task to submit to the database",
    type: "object",
    properties: {
        username: {
            description: "the username of the account",
            type: "string"
        },
        task: {
            description: "information about the completed task",
            type: "object",
            properties: {
                proj: {
                    description: "title of the project the task is grouped in",
                    type: "string"
                },
                cat: {
                    description: "title of the category the task is grouped in",
                    type: "string"
                },
                desc: {
                    description: "description of the completed task",
                    type: "string"
                },
                date: {
                    description: "Date object containing the time and date the task was entered",
                    type: "string"
                },
                year: {
                    description: "year (local) the task was entered",
                    type: "string"
                },
                month: {
                    description: "month (local) the task was entered",
                    type: "string"
                },
                day: {
                    description: "day (local) the task was entered",
                    type: "string"
                },
                xp: {
                    description: "XP value for completed task",
                    type: "integer"
                },
                type: {
                    description: "type category of the task",
                    type: "string"
                },
                completed: {
                    description: "completion status of task",
                    type: "boolean"
                },
                _id: {
                    description: "unique identifier for the task",
                    type: "string"
                }
            },
            required: ["proj", "cat", "desc", "date"]
        }
    },
    required: ["username", "task"]
};