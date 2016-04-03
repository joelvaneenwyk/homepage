var connect = require('connect');
var path = require('path');
var serveStatic = require('serve-static');
var http = require('http');
var finalhandler = require('finalhandler');
var harp = require('harp');

var siteRoot = __dirname + '/../../';
var port = 8081;

siteRoot = path.normalize(siteRoot);
console.log('Starting server [http://localhost:' + port + '/');
console.log('File server root: ' + siteRoot);

var express = require('express')
var app = express()
var mode = 'debug'

if (mode == 'debug') {
    app.use('/', serveStatic(siteRoot + 'source/site'))
}
else if (mode == 'staging') {
    app.use('/', serveStatic(siteRoot + 'dist/staging'))
}
else if (mode == 'release') {
    app.use('/', serveStatic(siteRoot + 'dist/release'))
}

app.use('/data', serveStatic(siteRoot + 'data'))
app.use('/play', serveStatic(siteRoot + 'source/playground'))
app.use('/thirdparty', serveStatic(siteRoot + "thirdparty"))
app.use('/blog', harp.mount(siteRoot + "data/blog"))

app.listen(port)
