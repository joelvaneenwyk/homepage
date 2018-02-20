/*jslint node: true */
"use strict";

var helpers = require('harp/lib/helpers');
var pkg = require('harp/package.json');
var terraform = require('terraform');
var mime = require('mime');
var path = require('path');
var beautify_html = require('js-beautify').html;
var minify = require('html-minifier').minify;

var _do_prettify = function(html) {
    var doMinify = true;
    var formatted = html;

    if (doMinify) {
        formatted = minify(formatted,
        {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true
        });
    }

    formatted = beautify_html(formatted, { indent_size: 2 });

    return formatted;
};

var _custom_process = function(req, rsp, next) {
    var normalizedPath = helpers.normalizeUrl('/public/' + req.url);
    var normalizedIndexPath = helpers.normalizeUrl('/public/' + req.url + '/index');
    var priorityList = terraform.helpers.buildPriorityList(normalizedPath);
    priorityList = priorityList.concat(terraform.helpers.buildPriorityList(normalizedIndexPath));
    var sourceFile = terraform.helpers.findFirstFile(req.setup.publicPath, priorityList);

    /**
     * We GTFO if we don't have a source file.
     */
    if (!sourceFile) {
        if (path.basename && path.basename(normalizedPath) === "index.html") {
            var pathAr = normalizedPath.split(path.sep);
            pathAr.pop(); // Pop index.html off the list
            var prospectCleanPath = pathAr.join("/");
            var prospectNormalizedPath = helpers.normalizeUrl(prospectCleanPath);
            var prospectPriorityList = terraform.helpers.buildPriorityList(prospectNormalizedPath);
            prospectPriorityList.push(path.basename(prospectNormalizedPath + ".html"));

            sourceFile = terraform.helpers.findFirstFile(req.setup.publicPath, prospectPriorityList);

            if (!sourceFile) {
                return next();
            } else {
                // 301 redirect
                rsp.statusCode = 301;
                rsp.setHeader('Location', prospectCleanPath);
                rsp.end('Redirecting to ' + prospectCleanPath);
            }

        } else {
            return next();
        }
    } else {
        /**
         * Now we let terraform handle the asset pipeline.
         */
        req.poly.render(sourceFile, function(error, body) {
            if (error) {
                error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno });

                var locals = {
                    project: req.headers.host,
                    error: error,
                    pkg: pkg
                };
                if (terraform.helpers.outputType(sourceFile) == 'css') {
                    var outputType = terraform.helpers.outputType(sourceFile);
                    var mimeType = helpers.mimeType(outputType);
                    var charset = mime.getType(mimeType);
                    var bodyInternal = helpers.cssError(locals);
                    rsp.statusCode = 200;
                    rsp.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''));
                    rsp.setHeader('Content-Length', Buffer.byteLength(bodyInternal, charset));
                    rsp.end(bodyInternal);
                } else {
                    terraform.root(__dirname + "/templates").render("error.jade", locals, function(err, body) {
                        var mimeType = helpers.mimeType('html');
                        var charset = mime.getType(mimeType);
                        rsp.statusCode = 500;
                        rsp.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''));
                        rsp.setHeader('Content-Length', Buffer.byteLength(body, charset));
                        rsp.end(body);
                    });
                }
            } else {
                // 404
                if (!body) return next();

                var formatted = _do_prettify(body);

                var outputTypeInternal = terraform.helpers.outputType(sourceFile);
                var mimeTypeInternal = helpers.mimeType(outputTypeInternal);
                var charsetInternal = mime.getType(mimeTypeInternal);
                rsp.statusCode = 200;
                rsp.setHeader('Content-Type', mimeTypeInternal + (charsetInternal ? '; charset=' + charsetInternal : ''));
                rsp.setHeader('Content-Length', Buffer.byteLength(formatted, charsetInternal));
                rsp.end(formatted);
            }
        });
    }
};

function prettify(harp) {
    // Override the process call and format the HTML after processing it
    harp.middleware.process = _custom_process;
}

module.exports = {
    prettify: prettify,
    html_prettify: _do_prettify
};
