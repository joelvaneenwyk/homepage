var connect = require('connect');
var path = require('path');
var serveStatic = require('serve-static');
var http = require('http');
var finalhandler = require('finalhandler');
var harp = require('harp');
var vhost = require('vhost');
var express = require('express');
var app = express.Router();
var favicon = require('serve-favicon');
var authenticate = require('./authenticate');
var prettify = require('./prettify');

var siteRoot = path.normalize(__dirname + '/../../');
var siteData = 'source/joelvaneenwyk/data';

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
    ["/", serveStatic(siteRoot + siteData)],
    ["/", favicon(siteRoot + siteData + '/favicon.ico')],
    ["/", serveStatic(siteRoot + 'data')],
    ["/", harp.mount(siteRoot + 'views')],
    ["/thirdparty", serveStatic(siteRoot + "thirdparty")]
];

console.log('Starting up Joel Van Eenwyk server application');

authenticate.setup(app);
app.route('/');

for (var i = 0; i < dictionary.length; i++) {
    for (var j = 0; j < allowedHosts.length; j++) {
        var path = dictionary[i][0];
        var func = dictionary[i][1];
        var host = allowedHosts[j];
        app.use(path, vhost(host, func));
    }
}

// Modify harp to prettify every HTML page that it outputs so that
// the source code looks pretty when viewing source on a page
prettify.prettify(harp);

app
    .use(function(req, res) {
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            res.render('404.ejs', { url: req.url });
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
            res.render('500.ejs', { url: req.url });
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

module.exports = app;
