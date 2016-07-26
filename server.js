/*jslint node: true */
"use strict";

// This is done automatically by Heroku but needs to be done
// manually if we are debugging through Visual Studio.
if (process.env.PG_REMOTE_URL === undefined) {
    delete process.env.PORT;
    console.log('Manually loading environment');
    require('dotenv').config();
}

var compression = require('compression');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var helmet = require('helmet');

console.log('Root Server Started');

// Don't expose server info
app.disable('x-powered-by');
// Show stack errors
app.set('showStackError', true);

app
    .use(compression())
    .use(cookieParser())
    .use(helmet())
    .use(
        function(req, res, next) {
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            console.log('Request URL: ', fullUrl);
            next();
        })
    .use('/', require('./source/joelvaneenwyk'))
    .use('/', require('./source/cowrk'));

var port = process.env.PORT || 5000;

console.log('Listing on port: ' + port);
app.listen(port);
