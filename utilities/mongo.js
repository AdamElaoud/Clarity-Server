const { MongoClient, ObjectId } = require("mongodb");
const Validator = require("./validator");
const LevelCurve = require("./levelCurve");
// load environment variables
require("dotenv-flow");

module.exports = {
    // update all documents
    async updateAllTasks() {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            // spread operator to prevent Objectid from being returned in response
            await tasks.updateMany(
                {},
                {
                    $set: {
                        matrix: "nuni"
                    }
                },
                { upsert: true }
            );

        } catch (err) {
            console.log(`error occured accessing database:\n ${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // add a task to the DB
    async addTask(req) {
        // validate structure of request
        Validator.validateTask(req); // throws error upon invalid JSON

        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            // spread operator to prevent Objectid from being returned in response
            const insertedTask = await tasks.insertOne({
                username: req.username,
                ...req.task,
                _id: new ObjectId(req.task._id)
            });

            return insertedTask;

        } catch (err) {
            console.log(`error occured accessing database:\n ${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // update field(s) on a task
    async updateTask(req) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            // spread operator to prevent Objectid from being returned in response
            const updatedTask = await tasks.updateOne(
                { _id:  new ObjectId(req._id) },
                {
                    $set: req.updates
                }
            );

            return updatedTask;

        } catch (err) {
            console.log(`error occured accessing database:\n ${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // delete a task
    async deleteTask(req) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            // spread operator to prevent Objectid from being returned in response
            await tasks.deleteOne({ _id: new ObjectId(req._id) });

        } catch (err) {
            console.log(`error occured accessing database:\n ${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // add a user to the DB
    async addUser(req) {
        // validate structure of request
        Validator.validateUser(req); // throws error upon invalid JSON

        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const users = db.collection("users");

            // spread operator to prevent Objectid from being returned in response
            await users.insertOne({
                currentXP: 0,
                totalXP: 0,
                level: 1,
                projects: {},
                ...req
            });

        } catch (err) {
            console.log(`error occured accessing database:\n ${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // update the level state of a user in the DB
    async updateLevelState(username, xp, level) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        // calculate total xp
        const totalXP = LevelCurve.normal[parseInt(level)] + parseInt(xp);

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const users = db.collection("users");

            await users.findOneAndUpdate(
                { "username": username },
                {
                    $set: {
                        "currentXP": parseInt(xp),
                        "level": parseInt(level),
                        "totalXP": totalXP
                    }
                }
            );

        } catch (err) {
            console.log(`error occured accessing database:\n ${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // add a project for an existing user in the DB
    async addProject(username, project) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const users = db.collection("users");

            await users.findOneAndUpdate(
                { "username": username },
                {
                    $set: {
                        [`projects.${project}`]: []
                    }
                }
            );

        } catch (err) {
            console.log(`error occured accessing database:\n ${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // add a category for an existing user in the DB
    async addCategory(username, project, category) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const users = db.collection("users");

            await users.findOneAndUpdate(
                { "username": username },
                {
                    $push: {
                        [`projects.${project}`]: category
                    }
                }
            );

        } catch (err) {
            console.log(`error occured accessing database:\n ${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // get the level state for a given user
    async getLevelState(username) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const users = db.collection("users");

            // find returns a cursor with applied filters
            const result = await users.find({
                "username": username,

            // use projection on cursor to only return certain values upon iteration
            }).project({
                username: 0,
                displayname: 0,
                detoxday: 0,
                projects: 0
            }).next();

            return result;

        } catch (err) {
            console.log(`error occured accessing database:\n${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // get days to detox for a given user
    async getDetoxData(username, date) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const users = db.collection("users");

            // find returns a cursor with applied filters
            const result = await users.find({
                "username": username,

            }).next();

            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            const detoxIndex = days.indexOf(result.detoxday);
            const dayIndex = new Date(date).getDay();

            // calculate days to detox
            const remaining = ((7 - dayIndex) + detoxIndex) % 7;

            return {
                detoxDay: result.detoxday,
                daysToDetox: remaining
            };

        } catch (err) {
            console.log(`error occured accessing database:\n${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // get projects and categories for a given user
    async getProjectTree(username) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const users = db.collection("users");

            const results = await users.find({
                "username": username

            // use projection on cursor to only return certain values upon iteration
            }).next();

            return results.projects;

        } catch (err) {
            console.log(`error occured accessing database:\n${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // get all tasks for a given user on a given date
    async getTasksOnDay(username, day, month, year) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            const results = await tasks.find({
                "username": username,
                "year": year,
                "month": month,
                "day": day

            // use projection on cursor to only return certain values upon iteration
            }).project({
                username: 0,
                year: 0,
                month: 0,
                day: 0
            }).toArray();

            return results;

        } catch (err) {
            console.log(`error occured accessing database:\n${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // get all tasks for a given user in a given month
    async getTasksInMonth(username, month, year) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            const results = await tasks.find({
                "username": username,
                "year": year,
                "month": month

            // use projection on cursor to only return certain values upon iteration
            }).project({
                username: 0,
                year: 0,
                month: 0,
                day: 0
            }).toArray();

            return results;

        } catch (err) {
            console.log(`error occured accessing database:\n${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // get all tasks for a given user in a given month, the previous month, and upcoming month
    async getTasksInSurroundingMonths(username, month, year) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const index = months.indexOf(month);
            const prevMonth = months[(index - 1 + 12) % 12];
            const nextMonth = months[(index + 1) % 12];

            // if current month is January, perform 2 queries
            if (month === "January") {
                const currAndNext = await tasks.find({
                    "username": username,
                    "year": year
                },
                {
                    $or: [
                        { "month": month },
                        { "month": nextMonth }
                    ]
    
                // use projection on cursor to only return certain values upon iteration
                }).project({
                    username: 0,
                    year: 0,
                    day: 0
                }).toArray();

                // subtract from year for December of previous year
                year--;

                const prev = await tasks.find({
                    "username": username,
                    "year": year.toString(),
                    "month": prevMonth
                }).project({
                    username: 0,
                    year: 0,
                    day: 0
                }).toArray();
    
                return prev.concat(currAndNext);

            } else {
                const results = await tasks.find({
                    "username": username,
                    "year": year
                },
                {
                    $or: [
                        { "month": month },
                        { "month": nextMonth },
                        { "month": prevMonth }
                    ]
    
                // use projection on cursor to only return certain values upon iteration
                }).project({
                    username: 0,
                    year: 0,
                    day: 0
                }).toArray();

                return results;
            }

        } catch (err) {
            console.log(`error occured accessing database:\n${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },


    
    // ------------------------------------- TO BE ARCHIVED -------------------------------------



    // get all tasks for a given user in the week of a given date
    async getTasksInWeek(username, date) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            // get start and end dates for the week
            const start = new Date(date);
            start.setDate(start.getDate() - start.getDay());

            const end = new Date(date);
            end.setDate(end.getDate() + (6 - end.getDay()));

            const results = await tasks.find(
                {
                    "username": username,
                    "year": start.toLocaleString("en-US", {"year": "numeric"}),
                    "month": start.toLocaleString("en-US", {month: "long"}),
                    "day": {
                        $gte: start.toLocaleString("en-US", {day: "2-digit"}),
                        $lte: end.toLocaleString("en-US", {day: "2-digit"})
                    }
                }
            ).toArray();

            return {
                start: start,
                end: end,
                tasks: results
            };

        } catch (err) {
            console.log(`error occured accessing database:\n${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // get info about tasks completed for day provided and previous day
    async getTaskCountInfo(username, currDay, currMonth, currYear, prevDay, prevMonth, prevYear) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            // current day info
            const currDayTasks = await tasks.find({
                "username": username,
                "year": currYear,
                "month": currMonth,
                "day": currDay

            }).toArray();

            // previous day info
            const prevDayTasks = await tasks.find({
                "username": username,
                "year": prevYear,
                "month": prevMonth,
                "day": prevDay

            }).toArray();

            return {
                curr: currDayTasks.length,
                prev: prevDayTasks.length
            };

        } catch (err) {
            console.log(`error occured accessing database:\n${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // get info about average xp gained for day provided and previous day
    async getAverageXP(username, currDay, currMonth, currYear, prevDay, prevMonth, prevYear) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            // current day info
            const currDayTasks = await tasks.find({
                "username": username,
                "year": currYear,
                "month": currMonth,
                "day": currDay

            }).toArray();

            // previous day info
            const prevDayTasks = await tasks.find({
                "username": username,
                "year": prevYear,
                "month": prevMonth,
                "day": prevDay

            }).toArray();

            // map tasks to array of XP values
            const currXP = currDayTasks.map(ele => ele.xp);
            const prevXP = prevDayTasks.map(ele => ele.xp);

            // calculate XP totals
            let currTotalXP = 0;
            if (currXP.length > 0)
                currTotalXP = currXP.reduce((a, b) => a + b);

            let prevTotalXP = 0;
            if (prevXP.length > 0)
                prevTotalXP = prevXP.reduce((a, b) => a + b);

            // calculate averages
            let currAverage = 0;
            if (currDayTasks.length > 0) {
                currAverage = currTotalXP / currDayTasks.length;
                currAverage = currAverage % 1 != 0 ? currAverage.toFixed(1) : currAverage;
            }

            let prevAverage = 0;
            if (prevDayTasks.length > 0) {
                prevAverage = prevTotalXP / prevDayTasks.length;
                prevAverage = prevAverage % 1 != 0 ? prevAverage.toFixed(1) : prevAverage;
            }

            return {
                curr: currAverage,
                prev: prevAverage
            };

        } catch (err) {
            console.log(`error occured accessing database:\n${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    },
    // get info about average xp gained for day provided and previous day
    async getAverageTasks(username, date, window) {
        // create database client
        const dbClient = new MongoClient(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("DetoxDB");

            const tasks = db.collection("tasks");

            // if window is week
            if (window === "week") {
                // get start and end dates in current window           
                const currStart = new Date(date);
                currStart.setDate(currStart.getDate() - currStart.getDay());

                const currEnd = new Date(date);
                currEnd.setDate(currEnd.getDate() + (6 - currEnd.getDay()));

                // get start and end dates in previous window           
                const prevStart = new Date(currStart);
                prevStart.setDate(prevStart.getDate() - 7);
                const prevEnd = new Date(currEnd);
                prevEnd.setDate(prevEnd.getDate() - 7);

                // current window info
                const currWindow = await tasks.find(
                    {
                        "username": username,
                        "year": currStart.toLocaleString("en-US", {"year": "numeric"}),
                        "month": currStart.toLocaleString("en-US", {month: "long"}),
                        "day": {
                            $gte: currStart.toLocaleString("en-US", {day: "2-digit"}),
                            $lte: currEnd.toLocaleString("en-US", {day: "2-digit"})
                        }
                    }
                ).toArray();

                // previous window info
                const prevWindow = await tasks.find(
                    {
                        "username": username,
                        "year": prevStart.toLocaleString("en-US", {"year": "numeric"}),
                        "month": prevStart.toLocaleString("en-US", {month: "long"}),
                        "day": {
                            $gte: prevStart.toLocaleString("en-US", {day: "2-digit"}),
                            $lte: prevEnd.toLocaleString("en-US", {day: "2-digit"})
                        }
                    }
                ).toArray();

                // calculate window averages
                let currAverage = currWindow.length / 7;
                currAverage = currAverage % 1 != 0 ? currAverage.toFixed(1) : currAverage;
                let prevAverage = prevWindow.length / 7;
                prevAverage = prevAverage % 1 != 0 ? prevAverage.toFixed(1) : prevAverage;

                return {
                    curr: currAverage,
                    prev: prevAverage
                };
            
            // if window is month
            } else if (window === "month") {
                const currDate = new Date(date);
                const prevDate = new Date(date);
                prevDate.setDate(prevDate.getMonth() - 1);

                // current window info
                const currWindow = await tasks.find(
                    {
                        "username": username,
                        "year": currDate.toLocaleString("en-US", {"year": "numeric"}),
                        "month": currDate.toLocaleString("en-US", {month: "long"})
                    }
                ).toArray();

                // previous window info
                const prevWindow = await tasks.find(
                    {
                        "username": username,
                        "year": prevDate.toLocaleString("en-US", {"year": "numeric"}),
                        "month": prevDate.toLocaleString("en-US", {month: "long"})
                    }
                ).toArray();

                // get days in month
                let currDays = new Date(currDate.getFullYear(), currDate.getMonth(), 0).getDate();
                let prevDays = new Date(prevDate.getFullYear(), prevDate.getMonth(), 0).getDate();

                // calculate window averages
                let currAverage = currWindow.length / currDays;
                currAverage = currAverage % 1 != 0 ? currAverage.toFixed(1) : currAverage;
                let prevAverage = prevWindow.length / prevDays;
                prevAverage = prevAverage % 1 != 0 ? prevAverage.toFixed(1) : prevAverage;

                return {
                    curr: currAverage,
                    prev: prevAverage
                };
            }

        } catch (err) {
            console.log(`error occured accessing database:\n${err}`);
            throw err;

        } finally {
            dbClient.close();
        }
    }
}
