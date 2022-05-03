function logger(req, resp, next) {
    console.log("----- BEGIN LOGGER MIDDLEWARE -----");

    // log the request URL
    console.log("Request received from:");
    console.log(`${req.method} ${req.protocol}:/${req.get("host")}${req.originalUrl}`);

    // log the request body
    console.log("Request body:");
    console.log(req.body);

    console.log("----- END LOGGER MIDDLEWARE -----");

    next();
}

module.exports = logger;