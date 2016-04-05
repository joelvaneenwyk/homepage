var path = require('path');
var serveStatic = require('serve-static');
var vhost = require('vhost');
var express = require('express')

var app = express.Router()
var favicon = require('serve-favicon');

var mode = process.env.config || 'debug'
var siteRoot = path.normalize(__dirname + '/../../');

if (mode == 'debug') {
    host = 'www.cowrktest.com'
}
else {
    host = 'www.cowrkapp.com'
}

console.log('Starting CoWrk Host: ' + host);

app.route('/')

app.use( '/', vhost(host, serveStatic(siteRoot + '/source/cowrk/data')) )
app.use( '/cowrk', vhost('localhost', serveStatic(siteRoot + '/source/cowrk/data')) )

module.exports = app;