/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var pjson = require('../package.json');

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

exports.updateBlogEntries = function(file, log) {
	var blogRoot = path.dirname(file);

	var blogEntries = getDirectories(blogRoot);

	var blogOutput = {};

	for (var entry in blogEntries)
	{
		var name = blogEntries[entry];

		blogOutput[name] = {};

		try
		{
			var blogInfo = JSON.parse(fs.readFileSync(path.join(blogRoot, name, '_data.json'), 'utf8'));
		    for (var key in blogInfo) {
		        blogOutput[name][key] = blogInfo[key];
		    }
		}
		catch(err)
		{
            log.writeln(err);
		}

		if (blogOutput[name].name === undefined) blogOutput[name].name = name;
		if (blogOutput[name].title === undefined) blogOutput[name].title = name;
		if (blogOutput[name].private === undefined) blogOutput[name].private = true;
		if (blogOutput[name].author === undefined) blogOutput[name].author = pjson.author.name;
		if (blogOutput[name].tags === undefined) blogOutput[name].tags = [];
	}

    return blogOutput;
};
