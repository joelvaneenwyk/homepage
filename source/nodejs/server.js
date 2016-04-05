var connect = require('connect');
var path = require('path');
var serveStatic = require('serve-static');
var http = require('http');
var finalhandler = require('finalhandler');
var harp = require('harp');
var vhost = require('vhost');

var siteRoot = __dirname + '/../../';

siteRoot = path.normalize(siteRoot);

var express = require('express')
var app = express.Router()
var favicon = require('serve-favicon');

var mode = process.env.config || 'debug'
var siteRoot = path.normalize(__dirname + '/../../');

site_root = ''

if (mode == 'debug' || mode == 'release') {
    site_root = 'source/site'
}
else if (mode == 'staging') {
    site_root = 'dist/staging'
}
else if (mode == 'release') {
    site_root = 'dist/release'
}

if (mode == 'debug') {
    jhost = 'www.joeltest.com'
}
else {
    jhost = 'www.joelvaneenwyk.com'
}

console.log('Server root: ' + site_root);
console.log('vhost: ' + jhost);

app.route('/')

app.use( '/', vhost('localhost', serveStatic(siteRoot + site_root)))
app.use( '/', vhost(jhost, serveStatic(siteRoot + site_root)))

app.use( vhost('localhost', serveStatic(siteRoot + site_root)))
app.use( vhost(jhost, favicon(siteRoot + site_root + '/favicon.ico')) )

app.use( '/data', vhost('localhost', serveStatic(siteRoot + 'data')))
app.use( '/data', vhost(jhost, serveStatic(siteRoot + 'data')))

app.use( '/blog', vhost('localhost', harp.mount(siteRoot + "data/blog")))
app.use( '/blog', vhost(jhost, harp.mount(siteRoot + "data/blog")))

app.use( '/play', vhost(jhost, serveStatic(siteRoot + 'source/playground')))
app.use( '/thirdparty', vhost(jhost, serveStatic(siteRoot + "thirdparty")))

module.exports = app;
