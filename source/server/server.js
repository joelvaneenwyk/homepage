/*jslint node: true */
"use strict";

var path = require('path');
var vhost = require('vhost');
var express = require('express');
var app = express.Router();
var favicon = require('serve-favicon');
var authenticate = require('./authenticate');
var environment = require('../lib/environment');

var fs = require('fs');
var harp = require('harp');

// one day in milliseconds
var oneDay = 24 * 60 * 60 * 1000;
var staticServeOptions = {
	// 8 days
  	maxAge: oneDay * 8
};

// Set defaults
var siteRoot = path.normalize(__dirname + '/../');
var siteStaging = '';
var siteWWW = '';
var siteViews = '';

// Determine where the staging area is by testing if there is a {ROOT}/dist/staging folder
// and if there isn't try the parent folder
fs.access(`${siteRoot}/app.json`, fs.F_OK, function(err) {
	if (err) {
		siteRoot = path.normalize(__dirname + '/../../');
	}
	siteStaging = path.resolve(path.join(__dirname, '..', '..', 'dist', 'staging'));
	siteWWW = path.resolve(siteStaging + '/../www/');
	siteViews = path.resolve(siteStaging + '/../views/');
	console.log(`Staging: ${siteStaging}`);
	console.log(`WWW: ${siteWWW}`);
	console.log(`Views: ${siteViews}`);
	initialize();
});

function initialize() {
	var allowedHosts = [
		'localhost',
		'joelvaneenwyk.com',
		'www.joelvaneenwyk.com',
		'joel.com',
		'www.joel.com',
		'joel',
		'jvaneenwyk.com',
		'www.jvaneenwyk.com',
		'*.herokuapp.com'
	];

	var mainApp = express.Router();

	mainApp.use("/",
		express.static(siteStaging, staticServeOptions));
	mainApp.use("/",
		favicon(siteStaging + '/favicon.ico'));
	mainApp.use("/data",
		express.static(siteRoot + '/source/data', staticServeOptions));
	mainApp.use("/",
		express.static(
			path.join(siteWWW, 'static'),
			{
				extensions: ['html'],
				maxage: staticServeOptions.maxage
			}));

	mainApp.use("/", harp.mount(siteViews));

	console.log('Starting up Joel Van Eenwyk server application');

	// We setup authentication first since it needs to route the traffic
	authenticate.setup(app, siteWWW, function() {
		for (var j = 0; j < allowedHosts.length; j++) {
			var host = allowedHosts[j];
			app.use(vhost(host, mainApp));
		}

		// Modify harp to prettify every HTML page that it outputs so that
		// the source code looks pretty when viewing source on a page
		var middleware = harp.middleware;

		 var prettify = require('./prettify');
		prettify.prettify(harp);

		var original_poly = middleware.poly;
		middleware.poly = function(req, rsp, next) {
			req.setup.config.globals = environment.getGlobals(req);
			original_poly(req, rsp, next);
		};

		app.use(function(req, res) {
			res.status(404);

			// respond with html page
			if (req.accepts('html')) {
				res.status(404).sendFile(siteWWW + '/static/404.html');
				return;
			}

			// respond with json
			if (req.accepts('json')) {
				res.send({ error: 'Not found' });
				return;
			}

			// default to plain-text. send()
			res.type('txt').send('Not found');
		});

		console.log('Joel Van Eenwyk server setup complete!');
	});
}

module.exports = app;
