/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var pjson = require('../package.json');

// https://github.com/mikedeboer/node-github
var GitHubApi = require("github");

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

function finalizeBlogEntry(blogOutput, name, author, done) {
    blogOutput[name].finished = true;

    if (blogOutput[name].name === undefined) blogOutput[name].name = name;
    if (blogOutput[name].title === undefined) blogOutput[name].title = name;
    if (blogOutput[name].private === undefined) blogOutput[name].private = true;
    if (blogOutput[name].author === undefined) blogOutput[name].author = author;
    if (blogOutput[name].tags === undefined) blogOutput[name].tags = [];

    var isDone = true;
    for (var key in blogOutput) {
        isDone &= blogOutput[key].finished;
    }

    if (isDone)
        done(blogOutput);
}

exports.updateBlogEntries = function(file, log, done) {
    var github;

    if (process.env.GITHUB_TOKEN !== undefined) {
        github = new GitHubApi({
            // optional
            debug: true,
            protocol: "https",
            host: "api.github.com", // should be api.github.com for GitHub
            Promise: require('bluebird'),
            // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
            followRedirects: false,
            timeout: 5000
        });

        github.authenticate({
            type: "oauth",
            token: process.env.GITHUB_TOKEN
        });
    }

    var blogRoot = path.dirname(file);
    var blogEntries = getDirectories(blogRoot);
    var blogOutput = {};

    for (let entry in blogEntries) {
        blogOutput[blogEntries[entry]] = {};
        blogOutput[blogEntries[entry]].finished = false;
    }

    for (let name in blogOutput) {
        try {
            let blogInfo = JSON.parse(fs.readFileSync(path.join(blogRoot, name, '_data.json'), 'utf8'));

            for (var key in blogInfo) {
                blogOutput[name][key] = blogInfo[key];
            }
        } catch (err) {
            log.writeln("Failed to parse json file for: " + name);
            finalizeBlogEntry(blogOutput, name, pjson.author.name, done);
        }

        if (github !== undefined) {
            let docPath = "source/joelvaneenwyk/views/public/blog/" + name + "/_data.md";
            log.writeln("Get Commits: " + docPath);

            // https://api.github.com/repos/joelvaneenwyk/homepage/commits?path=README.md
            github.repos.getCommits({
                user: "joelvaneenwyk",
                repo: process.env.GITHUB_REPO,
                path: docPath
            }, function(err, res) {
                log.writeln("Parsed: " + docPath);
                try {
                    if (res !== undefined && res.length > 0) {
                        blogOutput[name].commits = res.length;
                        blogOutput[name].lastCommitDate = res[0].commit.committer.date;
                    }
                    finalizeBlogEntry(blogOutput, name, pjson.author.name, done);
                } catch (getCommitsError) {
                    log.writeln("Failed to parse GitHub response: " + docPath);
                    finalizeBlogEntry(blogOutput, name, pjson.author.name, done);
                }
            });
        } else {
            finalizeBlogEntry(blogOutput, name, pjson.author.name, done);
        }
    }
};
