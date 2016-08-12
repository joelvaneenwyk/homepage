/*jslint node: true */
"use strict";

var path = require('path');
var vhost = require('vhost');
var express = require('express');
var app = express.Router();
var favicon = require('serve-favicon');
var pjson = require('../package.json');
var jsonminify = require("jsonminify");
var authenticate = require('./authenticate');

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

function getGlobals(req) {
	var g = {};

	g.version = process.env.HEROKU_RELEASE_VERSION;

	var created_date = new Date(process.env.HEROKU_RELEASE_CREATED_AT);
	var month = created_date.getUTCMonth() + 1;
	var day = created_date.getUTCDate();
	var year = created_date.getUTCFullYear();
	var date = year + "-" + month + "-" + day;

	var globals = {
		created: date,
		owner: pjson.author.name,
	};

	// Pass user information so that we can display things like
	// the profile picture and decide whether or not to show
	// a 'Login' button on the header
	var user;
	if (req.session !== undefined && req.session.passport !== undefined)
		user = req.session.passport.user;
	g.loggedIn = user !== undefined;
	g.user = jsonminify(JSON.stringify(user));

	// We pass in the current page so that it can be decided in EJS
	// which tab to highlight
	var pieces = req.url.split('/');
	if (pieces.length >= 2)
		g.page = pieces[1];
	else
		g.page = "";
	g.nav = {
		'Home': '',
		'Resume': 'resume',
		'Blog': 'blog'
	};
	g.created = globals.created;
	g.owner = globals.owner;
	g.globals = jsonminify(JSON.stringify(globals));
	g.environment = "production";
	g.footer = "© Copyright " + year + " " + globals.owner + " " + g.version;

	return g;
}

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
			req.setup.config.globals = getGlobals(req);
			original_poly(req, rsp, next);
		};

		app.use(function(req, res, next) {
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
