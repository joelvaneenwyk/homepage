var connect = require('connect');
var path = require('path');
var serveStatic = require('serve-static');
var http = require('http');
var finalhandler = require('finalhandler');
var harp = require('harp');

var siteRoot = __dirname + '/../../';

siteRoot = path.normalize(siteRoot);

var express = require('express')
var app = express()
var mode = 'heroku'

var port = 8081;

if (mode == 'heroku')
{
	port = process.env.PORT || 5000;
}

console.log('Starting server [http://localhost:' + port + '/');
console.log('File server root: ' + siteRoot);

if (mode == 'debug' || mode == 'heroku') {
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
