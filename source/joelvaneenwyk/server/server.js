/*jslint node: true */
"use strict";

var path = require('path');
var serveStatic = require('serve-static');
var vhost = require('vhost');
var express = require('express');
var app = express.Router();
var favicon = require('serve-favicon');

var authenticate = require('./authenticate');

var siteRoot = path.normalize(__dirname + '/../');
var siteData = siteRoot + '/www';
var siteStaging = siteRoot + '/dist/staging/';

var fs = require('fs');

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
        ["/", serveStatic(siteData)],
        ["/", serveStatic(siteStaging)],
        ["/", favicon(siteData + '/favicon.ico')],
        ["/", serveStatic(siteData + '/data')],
        //["/", harp.mount(siteRoot + '/views')],
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
    //var harp = require('harp');
    //var prettify = require('./prettify');
    //prettify.prettify(harp);

    app
        .use(function(req, res) {
            res.status(404);

            // respond with html page
            if (req.accepts('html')) {
                res.sendFile(siteStaging + '/404.html');
                return;
            }

            // respond with json
            if (req.accepts('json')) {
                res.send({ error: '404: File Not Found' });
                return;
            }

            // default to plain-text. send()
            res.type('txt').send('404: File Not Found');
        })
        .use(function(error, req, res, next) {
            res.status(500);

            // respond with html page
            if (req.accepts('html')) {
                res.sendFile(siteStaging + '/500.html');
                return;
            }

            // respond with json
            if (req.accepts('json')) {
                res.send({ error: '500: Internal Server Error' });
                return;
            }

            // default to plain-text. send()
            res.type('txt').send('500: Internal Server Error');
        });
}

module.exports = app;
