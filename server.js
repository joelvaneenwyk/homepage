/*jslint node: true */
"use strict";

var express = require('express');
var app = express();
console.log('Root Server Started');

app
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
