var path = require('path');
var serveStatic = require('serve-static');
var vhost = require('vhost');
var express = require('express')
var favicon = require('serve-favicon');

var app = express.Router()
var mode = process.env.config || 'debug'
var siteRoot = path.normalize(__dirname + '/../../');

var hosts = ['www.cowrkapp.com',
			 'cowrkapp.com',
			 'cowrktest.com',
			 'www.cowrktest.com']
var dictionary = [
    ["/", serveStatic(siteRoot + '/source/cowrk/data')],
    ["/", favicon(siteRoot + '/source/cowrk/data/favicon.ico')],
]

console.log('Starting up CoWrk app');

app.route('/')

for (var i = 0; i < dictionary.length; i++) {
    for (var j = 0; j < hosts.length; j++) {
        app.use( dictionary[i][0], vhost(hosts[j], dictionary[i][1]) );
    }
}

module.exports = app;