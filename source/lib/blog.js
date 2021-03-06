/* jslint node: true */

const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");
const pjson = require("../../package.json");

// https://github.com/mikedeboer/node-github

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter((file) => fs.statSync(path.join(srcpath, file)).isDirectory());
}

function finalizeBlogEntry(blogOutput, name, author, done) {
    blogOutput[name].finished = true;

    if (blogOutput[name].name === undefined) blogOutput[name].name = name;
    if (blogOutput[name].title === undefined) blogOutput[name].title = name;
    if (blogOutput[name].private === undefined) blogOutput[name].private = true;
    if (blogOutput[name].author === undefined) blogOutput[name].author = author;
    if (blogOutput[name].tags === undefined) blogOutput[name].tags = [];

    let isDone = true;
    for (const key in blogOutput) {
        isDone &= blogOutput[key].finished;
    }

    if (isDone) done(blogOutput);
}

exports.updateBlogEntries = function (file, log, done) {
    let github;

    if (process.env.GITHUB_TOKEN !== undefined) {
        github = new Octokit({
            // optional
            debug: true,
            protocol: "https",
            host: "api.github.com", // should be api.github.com for GitHub
            followRedirects: false,
            auth: process.env.GITHUB_TOKEN,
            request: {
                // Node.js only: advanced request options can be passed as http(s) agent,
                // such as custom SSL certificate or proxy settings.
                // See https://nodejs.org/api/http.html#http_class_http_agent
                agent: undefined,

                // request timeout in ms. 0 means no timeout
                timeout: 0
            }
        });
    }

    const blogRoot = path.dirname(file);
    const blogEntries = getDirectories(blogRoot);
    const blogOutput = {};

    for (const entry in blogEntries) {
        blogOutput[blogEntries[entry]] = {};
        blogOutput[blogEntries[entry]].finished = false;
    }

    for (const name in blogOutput) {
        try {
            const blogInfo = JSON.parse(fs.readFileSync(path.join(blogRoot, name, "_data.json"), "utf8"));

            for (const key in blogInfo) {
                blogOutput[name][key] = blogInfo[key];
            }
        } catch (err) {
            log.writeln(`Failed to parse json file for: ${name}`);
            finalizeBlogEntry(blogOutput, name, pjson.author.name, done);
        }

        let processMarkdown = false;

        if (github !== undefined) {
            processMarkdown = true;
        }

        // Forcing it off for now during refactor
        processMarkdown = false;

        if (processMarkdown) {
            const docPath = `source/views/public/blog/${name}/_data.md`;
            log.writeln(`Get Commits: ${docPath}`);

            // https://api.github.com/repos/joelvaneenwyk/homepage/commits?path=README.md
            github.repos.listCommits({
                user: "joelvaneenwyk",
                repo: process.env.GITHUB_REPO,
                path: docPath
            }, (err, res) => {
                if (err) {
                    log.writeln(err.stack);
                }
                log.writeln(`Parsed: ${docPath}`);
                try {
                    if (res !== undefined && res.length > 0) {
                        blogOutput[name].commits = res.length;
                        blogOutput[name].lastCommitDate = res[0].commit.committer.date;
                    }
                    finalizeBlogEntry(blogOutput, name, pjson.author.name, done);
                } catch (getCommitsError) {
                    log.writeln(`Failed to parse GitHub response: ${docPath}`);
                    finalizeBlogEntry(blogOutput, name, pjson.author.name, done);
                }
            });
        } else {
            finalizeBlogEntry(blogOutput, name, pjson.author.name, done);
        }
    }
};
