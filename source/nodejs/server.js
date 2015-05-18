var connect = require('connect');
var path = require('path');
var serveStatic = require('serve-static');
var http = require('http')

var siteRoot = __dirname + '/../site';
var port = 8080;
var serve = serveStatic(siteRoot, {});
var app = connect();

siteRoot = path.normalize(siteRoot);
console.log('Starting server [http://localhost:' + port + '/');
console.log('File server root: ' + siteRoot);

app.use(serve);

http.createServer(app).listen(port);