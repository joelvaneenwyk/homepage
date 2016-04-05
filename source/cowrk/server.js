var path = require('path');
var serveStatic = require('serve-static');
var vhost = require('vhost');
var express = require('express')

var siteRoot = __dirname + '/../../';

siteRoot = path.normalize(siteRoot);

var app = express.Router()
var favicon = require('serve-favicon');
var mode = 'debug'

console.log('Starting CoWrk server');
console.log('File server root: ' + siteRoot);

site_root = ''

if (mode == 'debug' || mode == 'heroku') {
    site_root = 'source/site'
}
else if (mode == 'staging') {
    site_root = 'dist/staging'
}
else if (mode == 'release') {
    site_root = 'dist/release'
}

if (mode == 'debug') {
    chost = 'www.cowrktest.com'
}
else {
    chost = 'www.cowrkapp.com'
}

console.log('vhost: ' + chost);

app.route('/')
app.use( '/', vhost('localhost', serveStatic(siteRoot + '/source/cowrk/data')))
app.use('/', vhost(chost, serveStatic(siteRoot + '/source/cowrk/data')) )

module.exports = app;