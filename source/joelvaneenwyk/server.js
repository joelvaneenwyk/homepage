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
var siteData = 'source/joelvaneenwyk/data'

var hosts = ['localhost',
			 'joelvaneenwyk.com',
			 'www.joelvaneenwyk.com',
			 'www.joeltest.com',
			 'jvaneenwyk.com',
			 'www.jvaneenwyk.com',
			 '*.herokuapp.com']
var dictionary = [
    ["/", serveStatic(siteRoot + siteData)],
    ["/", favicon(siteRoot + siteData + '/favicon.ico')],
    ["/", serveStatic(siteRoot + 'data')],
    ["/blog", harp.mount(siteRoot + "data/blog")],
    ["/play", serveStatic(siteRoot + 'data')],
    ["/thirdparty", serveStatic(siteRoot + "thirdparty")]
]

console.log('Starting up Joel Van Eenwyk app');

app.route('/')

for (var i = 0; i < dictionary.length; i++) {
    for (var j = 0; j < hosts.length; j++) {
        app.use( dictionary[i][0], vhost(hosts[j], dictionary[i][1]) );
    }
}

module.exports = app;
