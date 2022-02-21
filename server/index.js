const express = require("express");
const Logger = require("./middleware/logger");
require("dotenv-flow").config();

// defaults to port 3001 if no value is given for the environment variable
const PORT = process.env.PORT || 5000;

const app = express();

// initialize middleware
app.use(express.json()); // JSON parser
app.use(express.urlencoded({ extended: false })); // form submission parser (url encoded data)
app.use(Logger); // logger
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// ROUTES
app.use("/api/user", require("./routes/api/user"));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});