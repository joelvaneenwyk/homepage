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

var siteRoot = path.normalize(__dirname + '/../');
var siteStaging = siteRoot + '/dist/staging/';
var siteWWW = siteStaging + '../www/';
var siteViews = siteStaging + '../views/';

var oneDay = 24 * 60 * 60 * 1000; // one day in milliseconds
var staticServeOptions = {
  maxAge: oneDay * 8 // 8 days
};

// Determine where the staging area is by testing if there is a joelvaneenwyk/dist/staging folder
// and if there isn't try the parent folder
fs.access(siteStaging, fs.F_OK, function(err) {
	var pathTemp = require('path');
	if (err) {
		siteStaging = pathTemp.join(__dirname, '..', '..', '..', 'dist', 'staging');
	}
	siteStaging = pathTemp.resolve(siteStaging);
	siteWWW = pathTemp.resolve(siteStaging + '/../www/');
	siteViews = pathTemp.resolve(siteStaging + '/../views/');
	console.log(siteStaging);
	console.log(siteWWW);
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

	mainApp.use("/", express.static(siteStaging, staticServeOptions));
	mainApp.use("/", favicon(siteStaging + '/favicon.ico'));
	mainApp.use("/data", express.static(siteRoot + '/data', staticServeOptions));
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
