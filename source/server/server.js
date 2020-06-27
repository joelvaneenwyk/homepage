/* jslint node: true */

const path = require("path");
const vhost = require("vhost");
const express = require("express");

const app = express.Router();
const favicon = require("serve-favicon");
const fs = require("fs");
const harp = require("harp");
const authenticate = require("./authenticate");
const environment = require("../lib/environment");

// one day in milliseconds
const oneDay = 24 * 60 * 60 * 1000;
const staticServeOptions = {
    // 8 days
    maxAge: oneDay * 8
};

// Set defaults
let siteRoot = path.normalize(`${__dirname}/../`);
let siteStaging = "";
let siteWWW = "";
let siteViews = "";

function initialize() {
    const allowedHosts = [
        "localhost",
        "joelvaneenwyk.com",
        "www.joelvaneenwyk.com",
        "joel.com",
        "www.joel.com",
        "joel",
        "jvaneenwyk.com",
        "www.jvaneenwyk.com",
        "*.herokuapp.com"
    ];

    const mainApp = express.Router();

    mainApp.use("/",
        express.static(siteStaging, staticServeOptions));
    mainApp.use("/",
        favicon(`${siteStaging}/favicon.ico`));
    mainApp.use("/data",
        express.static(`${siteRoot}/source/data`, staticServeOptions));
    mainApp.use("/",
        express.static(
            path.join(siteWWW, "static"),
            {
                extensions: ["html"],
                maxage: staticServeOptions.maxage
            }
        ));

    mainApp.use("/", harp.mount(siteViews));

    console.log("Starting up Joel Van Eenwyk server application");

    // We setup authentication first since it needs to route the traffic
    authenticate.setup(app, siteWWW, () => {
        for (let j = 0; j < allowedHosts.length; j++) {
            const host = allowedHosts[j];
            app.use(vhost(host, mainApp));
        }

        // Modify harp to prettify every HTML page that it outputs so that
        // the source code looks pretty when viewing source on a page
        const { middleware } = harp;

        const prettify = require("./prettify");
        prettify.prettify(harp);

        const originalPoly = middleware.poly;

        middleware.poly = function customPoly(req, rsp, next) {
            req.setup.config.globals = environment.getGlobals(req);
            originalPoly(req, rsp, next);
        };

        app.use((req, res) => {
            res.status(404);

            // respond with html page
            if (req.accepts("html")) {
                res.status(404).sendFile(`${siteWWW}/static/404.html`);
                return;
            }

            // respond with json
            if (req.accepts("json")) {
                res.send({ error: "Not found" });
                return;
            }

            // default to plain-text. send()
            res.type("txt").send("Not found");
        });

        console.log("Joel Van Eenwyk server setup complete!");
    });
}

// Determine where the staging area is by testing if there is a {ROOT}/dist/staging folder
// and if there isn't try the parent folder
fs.access(`${siteRoot}/app.json`, fs.F_OK, (err) => {
    if (err) {
        siteRoot = path.normalize(`${__dirname}/../../`);
    }
    siteStaging = path.resolve(path.join(__dirname, "..", "..", "dist", "staging"));
    siteWWW = path.resolve(`${siteStaging}/../www/`);
    siteViews = path.resolve(`${siteStaging}/../views/`);
    console.log(`Staging: ${siteStaging}`);
    console.log(`WWW: ${siteWWW}`);
    console.log(`Views: ${siteViews}`);
    initialize();
});

module.exports = app;
