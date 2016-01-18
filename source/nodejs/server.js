var connect = require('connect');
var path = require('path');
var serveStatic = require('serve-static');
var http = require('http');
var finalhandler = require('finalhandler');

var siteRoot = __dirname + '/../../';
var port = 8080;

siteRoot = path.normalize(siteRoot);
console.log('Starting server [http://localhost:' + port + '/');
console.log('File server root: ' + siteRoot);

//var serve = serveStatic(siteRoot, {});
//var app = connect();
//app.use(serve);


//var server = http.createServer(function (req, res) {
//    var done = finalhandler(req, res)
//    serve(req, res, done)
//})

//var app = express()
var express = require('express')
var app = express()
app.use(serveStatic(siteRoot + 'playground'))
//app.use(serveStatic(siteRoot + 'source\test'))
app.listen(port)

//server.listen(port);

//http.createServer(function (req, res) {
//    file.serve(req, res);
//}).listen(8080);
