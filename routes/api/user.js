const router = require("express").Router();
const Mongo = require("../../utilities/mongo");

/* ------------------------------------------------- GET ------------------------------------------------- */

// get the current XP, level, and total XP for a given user
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

// get projects and categories for a given user
router.get("/getProjectTree/:username", async (req, res) => {
    try {
        const projects = await Mongo.getProjectTree(req.params.username);

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

// get detox day and days to detox for a given user
router.get("/getDetoxData/:username/:date", async (req, res) => {
    try {
        const detoxData = await Mongo.getDetoxData(req.params.username, req.params.date);

        res.status(200).json({
            message: `retrieval of detox data for ${req.params.username} successful`,
            detoxData: detoxData
        });

    } catch (err) {
        res.status(500).json({
            message: `retrieval of detox data for ${req.params.username} unsuccessful`,
            error: err
        });
    }
});

/* ------------------------------------------------- POST ------------------------------------------------- */

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

/* ------------------------------------------------- ARCHIVED ------------------------------------------------- */

// get days to detox for a given user
// router.get("/getDaysToDetox/:username/:date", async (req, res) => {
//     try {
//         const daysToDetox = await Mongo.getDaysToDetox(req.params.username, req.params.date);

//         res.status(200).json({
//             message: `retrieval of days to detox for ${req.params.username} successful`,
//             daysToDetox: daysToDetox
//         });

//     } catch (err) {
//         res.status(500).json({
//             message: `retrieval of days to detox for ${req.params.username} unsuccessful`,
//             error: err
//         });
//     }
// });

module.exports = router;