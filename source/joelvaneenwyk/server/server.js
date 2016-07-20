/*jslint node: true */
"use strict";

var path = require('path');
var serveStatic = require('serve-static');
var vhost = require('vhost');
var express = require('express');
var app = express.Router();
var favicon = require('serve-favicon');
var pjson = require('../package.json');
var jsonminify = require("jsonminify");
var authenticate = require('./authenticate');

var siteRoot = path.normalize(__dirname + '/../');
var siteStaging = siteRoot + '/dist/staging/';
var siteWWW = siteStaging + '../www/';

var fs = require('fs');

// Determine where the staging area is by testing if there is a joelvaneenwyk/dist/staging folder
// and if there isn't try the parent folder
fs.access(siteStaging, fs.F_OK, function(err) {
    var pathTemp = require('path');
    if (err) {
        siteStaging = pathTemp.join(__dirname, '..', '..', '..', 'dist', 'staging');
    }
    siteStaging = pathTemp.resolve(siteStaging);
    siteWWW = pathTemp.resolve(siteStaging + '/../www/');
    console.log(siteStaging);
    console.log(siteWWW);
    initialize();
});


function initialize() {
    var allowedHosts = [
        'localhost',
        'joelvaneenwyk.com',
        'www.joelvaneenwyk.com',
        'joel.com',
        'www.joel.com',
        'joel',
        'jvaneenwyk.com',
        'www.jvaneenwyk.com',
        '*.herokuapp.com'
    ];

    var mainApp = express.Router();
    mainApp.use("/thirdparty", serveStatic(siteRoot + '/thirdparty'));
    mainApp.use("/", serveStatic(siteStaging));
    mainApp.use("/", favicon(siteStaging + '/favicon.ico'));
    mainApp.use("/data", serveStatic(siteRoot + '/data'));
    mainApp.use("/",
        serveStatic(
            path.join(siteWWW, 'public'),
            {
                extensions: ['html']
            }));
    mainApp.use("/p", serveStatic(path.join(siteWWW, 'private')));

    console.log('Starting up Joel Van Eenwyk server application');

    // We setup authentication first since it needs to route the traffic
    authenticate.setup(mainApp, function() {
        for (var j = 0; j < allowedHosts.length; j++) {
            var host = allowedHosts[j];
            app.use(vhost(host, mainApp));
        }

        // Modify harp to prettify every HTML page that it outputs so that
        // the source code looks pretty when viewing source on a page
        var harp = require('harp');
        var middleware = harp.middleware;

        var prettify = require('./prettify');
        prettify.prettify(harp);

        var original_poly = middleware.poly;
        middleware.poly = function(req, rsp, next) {
            req.setup.config.globals.version = process.env.HEROKU_RELEASE_VERSION;

            var created_date = new Date(process.env.HEROKU_RELEASE_CREATED_AT);
            var month = created_date.getUTCMonth() + 1;
            var day = created_date.getUTCDate();
            var year = created_date.getUTCFullYear();
            var date = year + "-" + month + "-" + day;

            var globals = {
                created: date,
                owner: pjson.author.name,
            };

            req.setup.config.globals.created = globals.created;
            req.setup.config.globals.owner = globals.owner;
            req.setup.config.globals.globals = jsonminify(JSON.stringify(globals));

            original_poly(req, rsp, next);
        };

        app.use(function(req, res, next) {
            res.status(404);

            // respond with html page
            if (req.accepts('html')) {
                res.status(404).sendFile(siteWWW + '/public/404.html');
                return;
            }

            // respond with json
            if (req.accepts('json')) {
                res.send({ error: 'Not found' });
                return;
            }

            // default to plain-text. send()
            res.type('txt').send('Not found');
        });
    });
}

module.exports = app;
