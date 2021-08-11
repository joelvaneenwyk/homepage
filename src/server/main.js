/* jslint node: true */

const dotenv = require("dotenv");

// Currently we ignore all errors but at least log them
process.on("uncaughtException", (exception) => {
    console.error("Ran into exception but we are ignoring. Full details:");
    console.error(exception);
});

// This is done automatically by Heroku but needs to be done
// manually if we are debugging through Visual Studio.
if (process.env.PG_REMOTE_URL === undefined) {
    delete process.env.PORT;
    console.log("Manually loading environment");
    dotenv.config({ silent: true });
}

const compression = require("compression");
const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

console.log("Root Server Started");

// Don't expose server info
app.disable("x-powered-by");

// Show stack errors
app.set("showStackError", true);

// This is expensive but makes client-side HTML cleaner
app.locals.pretty = false;

const useSecureConnection = process.env.USE_SECURE !== undefined && process.env.USE_SECURE === true;

app
    .use(compression())
    .use(cookieParser())
    .use(helmet(
        {
            // Strict-Transport-Security should only be enabled if we are using HTTPS
            // See here for more details: https://helmetjs.github.io/docs/hsts/
            hsts: useSecureConnection
        }
    ))
    .use(
        (req, res, next) => {
            const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
            console.log(`Request URL: ${fullUrl}`);
            next();
        }
    )
    .use("/", require("./source/server/server"));

// Use a default port of 5000 unless it's specified in server config
const port = process.env.PORT || 5000;

console.log(`Listing on port: ${port}`);
app.listen(port);
