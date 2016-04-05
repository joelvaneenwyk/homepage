var connect = require('connect');
var path = require('path');
var serveStatic = require('serve-static');
var http = require('http');
var finalhandler = require('finalhandler');
var harp = require('harp');
var vhost = require('vhost');
var express = require('express')
var app = express.Router()
var favicon = require('serve-favicon');

var mode = process.env.config || 'debug'
var siteRoot = path.normalize(__dirname + '/../../');

site_root = 'source/joelvaneenwyk/data'

if (mode == 'debug') {
    host = 'www.joeltest.com'
}
else {
    host = 'www.joelvaneenwyk.com'
}

console.log('Starting Joel Van Eenwyk Host: ' + host);

app.route('/')

app.use( '/', vhost('localhost', serveStatic(siteRoot + site_root)))
app.use( '/', vhost(host, serveStatic(siteRoot + site_root)))

app.use( vhost('localhost', favicon(siteRoot + site_root + '/favicon.ico')) )
app.use( vhost(host, favicon(siteRoot + site_root + '/favicon.ico')) )

app.use( '/data', vhost('localhost', serveStatic(siteRoot + 'data')))
app.use( '/data', vhost(host, serveStatic(siteRoot + 'data')))

app.use( '/blog', vhost('localhost', harp.mount(siteRoot + "data/blog")))
app.use( '/blog', vhost(host, harp.mount(siteRoot + "data/blog")))

app.use( '/play', vhost('localhost', serveStatic(siteRoot + 'source/playground')))
app.use( '/play', vhost(host, serveStatic(siteRoot + 'source/playground')))

app.use( '/thirdparty', vhost('localhost', serveStatic(siteRoot + "thirdparty")))
app.use( '/thirdparty', vhost(host, serveStatic(siteRoot + "thirdparty")))

module.exports = app;
