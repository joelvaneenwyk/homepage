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

var fs = require('fs');
var harp = require('harp');
var middleware = harp.middleware;

// Determine where the staging area is by testing if there is a joelvaneenwyk/dist/staging folder
// and if there isn't try the parent folder
fs.access(siteStaging, fs.F_OK, function(err) {
    var pathTemp = require('path');
    if (err) {
        siteStaging = pathTemp.join(__dirname, '..', '..', '..', 'dist', 'staging');
    }
    console.log(siteStaging);
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

    var dictionary = [
        ["/thirdparty", serveStatic(siteRoot + '/thirdparty')],
        ["/", serveStatic(siteStaging)],
        ["/", favicon(siteStaging + '/favicon.ico')],
        ["/data", serveStatic(siteRoot + '/data')],
        ["/", function(req, rsp, next) {
            harp.mount(siteRoot + '/views')(req, rsp, next);
        }],
    ];

    console.log('Starting up Joel Van Eenwyk server application');

    authenticate.setup(app);
    app.route('/');

    for (var i = 0; i < dictionary.length; i++) {
        for (var j = 0; j < allowedHosts.length; j++) {
            var remoteUrl = dictionary[i][0];
            var func = dictionary[i][1];
            var host = allowedHosts[j];
            app.use(remoteUrl, vhost(host, func));
        }
    }

    // Modify harp to prettify every HTML page that it outputs so that
    // the source code looks pretty when viewing source on a page
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

    var helpers = require('harp/lib/helpers');
    var mime = require('mime');
    app.use(function(req, rsp) {
        var sourceFile = '404.ejs';
        req.poly.render(sourceFile,
            function(error, body) {
                var type = helpers.mimeType("html");
                var charset = mime.charsets.lookup(type);
                rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
                rsp.setHeader('Content-Length', Buffer.byteLength(body, charset));
                rsp.statusCode = 404;
                rsp.end(body);
            });
    });
}

module.exports = app;
