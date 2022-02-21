const router = require("express").Router();
const Mongo = require("../../utilities/mongo");

// add a task to the DB
router.post("/addTask", async (req, res) => {
    try {
        await Mongo.addTask(req.body);

        res.status(200).json({
            message: `stored task for ${req.body.username} to database`,
            data: req.body
        });

    } catch (err) {
        res.status(500).json({
            message: `data submission for ${req.body.username} unsuccessful`,
            error: err,
            data: req.body
        });
    }
});

// add a user to the DB
router.post("/addUser", async (req, res) => {
    try {
        await Mongo.addUser(req.body);

        res.status(200).json({
            message: `added new user ${req.body.displayname} to database`,
            data: req.body
        });

    } catch (err) {
        res.status(500).json({
            message: `user submission for ${req.body.displayname} unsuccessful`,
            error: err,
            data: req.body
        });
    }
});

// update the level state of a user in the DB
router.post("/updateLevelState/:username/:xp/:level", async (req, res) => {
    try {
        await Mongo.updateLevelState(req.params.username, req.params.xp, req.params.level);

        res.status(200).json({
            message: `update of XP and level for ${req.params.username} successful`,
        });

    } catch (err) {
        res.status(500).json({
            message: `update of XP and level for ${req.params.username} unsuccessful`,
            error: err
        });
    }
});

// add a project for an existing user in the DB
router.post("/addProject/:username/:project", async (req, res) => {
    try {
        await Mongo.addProject(req.params.username, req.params.project);

        res.status(200).json({
            message: `adding of new project ${req.params.project} for ${req.params.username} successful`
        });

    } catch (err) {
        res.status(500).json({
            message: `adding of new project ${req.params.project} for ${req.params.username} unsuccessful`,
            error: err
        });
    }
});

// add a category for an existing user in the DB
router.post("/addCategory/:username/:project/:category", async (req, res) => {
    try {
        await Mongo.addCategory(req.params.username, req.params.project, req.params.category);

        res.status(200).json({
            message: `adding of new category ${req.params.category} to ${req.params.project} for ${req.params.username} successful`
        });

    } catch (err) {
        res.status(500).json({
            message: `adding of new category ${req.params.category} to ${req.params.project} for ${req.params.username} unsuccessful`,
            error: err
        });
    }
});

// get the level state for a given user
router.get("/getLevelState/:username", async (req, res) => {
    try {
        const levelState = await Mongo.getLevelState(req.params.username);

        res.status(200).json({
            message: `retrieval of level state for ${req.params.username} successful`,
            levelState: levelState
        });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of level state for ${req.params.username} unsuccessful`,
            error: err
        });
    }
});

// get days to detox for a given user
router.get("/getDaysToDetox/:username/:date", async (req, res) => {
    try {
        const daysToDetox = await Mongo.getDaysToDetox(req.params.username, req.params.date);

        res.status(200).json({
            message: `retrieval of days to detox for ${req.params.username} successful`,
            daysToDetox: daysToDetox
        });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of days to detox for ${req.params.username} unsuccessful`,
            error: err
        });
    }
});

// get projects and categories for a given user
router.get("/getProjects/:username", async (req, res) => {
    try {
        const projects = await Mongo.getProjects(req.params.username);

        if (projects.length < 1) 
            res.status(200).json({
                message: `there are no projects for ${req.params.username}`,
                projects: projects
            });
        else
            res.status(200).json({
                message: `retrieval of projects for ${req.params.username} successful`,
                projects: projects
            });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of projects for ${req.params.username} unsuccessful`,
            error: err
        });
    }
});

// get all tasks for a given user on a given date
router.get("/getTasksOnDay/:username/:year/:month/:day", async (req, res) => {
    try {
        const taskList = await Mongo.getTasksOnDay(req.params.username, req.params.day, req.params.month, req.params.year);

        if (taskList.length < 1) 
            res.status(200).json({
                message: `there are no tasks for ${req.params.username} on ${req.params.month} ${req.params.day}, ${req.params.year}`,
                tasks: taskList
            });
        else
            res.status(200).json({
                message: `retrieval of tasks for ${req.params.username} on ${req.params.month} ${req.params.day}, ${req.params.year} successful`,
                tasks: taskList
            });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of tasks for ${req.params.username} on ${req.params.month} ${req.params.day}, ${req.params.year} unsuccessful`,
            error: err
        });
    }
});

// get all tasks for a given user in a given month
router.get("/getTasksInMonth/:username/:year/:month", async (req, res) => {
    try {
        const taskList = await Mongo.getTasksInMonth(req.params.username, req.params.month, req.params.year);

        if (taskList.length < 1) 
            res.status(200).json({
                message: `there are no tasks for ${req.params.username} in the month of ${req.params.month}, ${req.params.year}`,
                tasks: taskList
            });
        else
            res.status(200).json({
                message: `retrieval of tasks for ${req.params.username} in the month of ${req.params.month}, ${req.params.year} successful`,
                tasks: taskList
            });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of tasks for ${req.params.username} in the month of ${req.params.month}, ${req.params.year} unsuccessful`,
            error: err
        });
    }
});

// get all tasks for a given user in a given month, the previous month, and upcoming month
router.get("/getTasksInSurroundingMonths/:username/:year/:month", async (req, res) => {
    try {
        const taskList = await Mongo.getTasksInSurroundingMonths(req.params.username, req.params.month, req.params.year);

        if (taskList.length < 1) 
            res.status(200).json({
                message: `there are no tasks for ${req.params.username} in the surrounding months of ${req.params.month}, ${req.params.year}`,
                tasks: taskList
            });
        else
            res.status(200).json({
                message: `retrieval of tasks for ${req.params.username} in the surrounding months of ${req.params.month}, ${req.params.year} successful`,
                tasks: taskList
            });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of tasks for ${req.params.username} in the surrounding months of ${req.params.month}, ${req.params.year} unsuccessful`,
            error: err
        });
    }
});

// get all tasks for a given user in the week of a given date
router.get("/getTasksInWeek/:username/:date", async (req, res) => {
    try {
        const taskList = await Mongo.getTasksInWeek(req.params.username, req.params.date);

        if (taskList.length < 1) 
            res.status(200).json({
                message: `there are no tasks for ${req.params.username} in the week of ${new Date(req.params.date).toLocaleString()}`,
                data: taskList
            });
        else
            res.status(200).json({
                message: `retrieval of tasks for ${req.params.username} in the week of ${new Date(req.params.date).toLocaleString()} successful`,
                data: taskList
            });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of tasks for ${req.params.username} in the week of ${new Date(req.params.date).toLocaleString()} unsuccessful`,
            error: err
        });
    }
});

// get info about tasks completed for day provided and previous day
router.get("/getTaskCountInfo/:username/:currYear/:currMonth/:currDay/:prevYear/:prevMonth/:prevDay", async (req, res) => {
    try {
        const taskCounts = await Mongo.getTaskCountInfo(req.params.username, req.params.currDay, req.params.currMonth, req.params.currYear,
                                                    req.params.prevDay, req.params.prevMonth, req.params.prevYear);

            res.status(200).json({
                message: `retrieval of task count info for ${req.params.username} on ${req.params.currMonth} ${req.params.currDay}, ${req.params.currYear} and ${req.params.prevMonth} ${req.params.prevDay}, ${req.params.prevYear} successful`,
                counts: taskCounts
            });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of task count info for ${req.params.username} on ${req.params.currMonth} ${req.params.currDay}, ${req.params.currYear} and ${req.params.prevMonth} ${req.params.prevDay}, ${req.params.prevYear} unsuccessful`,
            error: err
        });
    }
});

// get info about average xp gained for day provided and previous day
router.get("/getAverageXP/:username/:currYear/:currMonth/:currDay/:prevYear/:prevMonth/:prevDay", async (req, res) => {
    try {
        const xpAverages = await Mongo.getAverageXP(req.params.username, req.params.currDay, req.params.currMonth, req.params.currYear,
                                                    req.params.prevDay, req.params.prevMonth, req.params.prevYear);

            res.status(200).json({
                message: `retrieval of average XP for ${req.params.username} on ${req.params.currMonth} ${req.params.currDay}, ${req.params.currYear} and ${req.params.prevMonth} ${req.params.prevDay}, ${req.params.prevYear} successful`,
                averages: xpAverages
            });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of average XP for ${req.params.username} on ${req.params.currMonth} ${req.params.currDay}, ${req.params.currYear} and ${req.params.prevMonth} ${req.params.prevDay}, ${req.params.prevYear} unsuccessful`,
            error: err
        });
    }
});

// get info about average tasks completed for day provided and previous day
router.get("/getAverageTasks/:username/:date/:window", async (req, res) => {
    try {
        const taskAverages = await Mongo.getAverageTasks(req.params.username, req.params.date, req.params.window);

            res.status(200).json({
                message: `retrieval of average tasks for ${req.params.username} on ${new Date(req.params.date).toLocaleString()} successful`,
                averages: taskAverages
            });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of average tasks for ${req.params.username} on ${new Date(req.params.date).toLocaleString()} unsuccessful`,
            error: err
        });
    }
});

module.exports = router;