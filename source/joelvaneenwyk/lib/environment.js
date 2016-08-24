/*jslint node: true */
"use strict";

var jsonminify = require("jsonminify");
var pjson = require('../package.json');
var harpjson = require('../views/_harp.json');

function updateGlobals(g) {
	g.version = process.env.HEROKU_RELEASE_VERSION;

	var created_date = new Date(process.env.HEROKU_RELEASE_CREATED_AT);
	var month = created_date.getUTCMonth() + 1;
	var day = created_date.getUTCDate();
	var year = created_date.getUTCFullYear();
	var date = year + "-" + month + "-" + day;

	// Pull out the existing globals first
	var globals = g.globals;

	if (globals === undefined )
		globals = {};

	globals.created = date;
	globals.owner = pjson.author.name;

	g.nav = {
		'Home': '',
		'Resume': 'resume',
		'Blog': 'blog'
	};

	g.created = globals.created;
	g.owner = globals.owner;
	g.environment = "production";
	g.footer = "© Copyright " + year + " " + globals.owner + " " + g.version;

	var public_globals = {};
	public_globals.owner = g.owner;
	public_globals.environment = g.environment;

	g.public_globals = JSON.stringify(public_globals);

	return g;
};

exports.getGlobals = function(req) {
	var g = updateGlobals(harpjson);

	if (req !== undefined)
	{
		// Pass user information so that we can display things like
		// the profile picture and decide whether or not to show
		// a 'Login' button on the header
		var user;
		if (req.session !== undefined && req.session.passport !== undefined)
	        user = req.session.passport.user;
	    g.user = jsonminify(JSON.stringify(user));
		g.loggedIn = (g.user !== "");

		// We pass in the current page so that it can be decided in EJS
		// which tab to highlight
		var pieces = req.url.split('/');
		if (pieces.length >= 2)
			g.page = pieces[1];
		else
			g.page = "";
	}

	return g;
};
