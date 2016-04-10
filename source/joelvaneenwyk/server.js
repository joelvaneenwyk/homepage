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
var siteData = 'source/joelvaneenwyk/data';

var html = require('html')
var helpers = require('../../node_modules/harp/lib/helpers')
var pkg = require('../../node_modules/harp/package.json')
var terraform = require('terraform')
var mime = require('mime')
var beautify_html = require('js-beautify').html;

custom_process = function(req, rsp, next) {
    var normalizedPath = helpers.normalizeUrl(req.url);
    var priorityList = terraform.helpers.buildPriorityList(normalizedPath);
    var sourceFile = terraform.helpers.findFirstFile(req.setup.publicPath, priorityList);

    /**
     * We GTFO if we don't have a source file.
     */
    if (!sourceFile) {
        if (path.basename && path.basename(normalizedPath) === "index.html") {
            var pathAr = normalizedPath.split(path.sep);
            pathAr.pop() // Pop index.html off the list
            var prospectCleanPath = pathAr.join("/")
            var prospectNormalizedPath = helpers.normalizeUrl(prospectCleanPath)
            var prospectPriorityList = terraform.helpers.buildPriorityList(prospectNormalizedPath)
            prospectPriorityList.push(path.basename(prospectNormalizedPath + ".html"))

            sourceFile = terraform.helpers.findFirstFile(req.setup.publicPath, prospectPriorityList)

            if (!sourceFile) {
                return next()
            } else {
                // 301 redirect
                rsp.statusCode = 301
                rsp.setHeader('Location', prospectCleanPath)
                rsp.end('Redirecting to ' + utilsEscape(prospectCleanPath))
            }

        } else {
            return next()
        }
    } else {
        /**
         * Now we let terraform handle the asset pipeline.
         */
        req.poly.render(sourceFile, function(error, body) {
            if (error) {
                error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno })

                var locals = {
                    project: req.headers.host,
                    error: error,
                    pkg: pkg
                }
                if (terraform.helpers.outputType(sourceFile) == 'css') {
                    var outputType = terraform.helpers.outputType(sourceFile)
                    var mimeType = helpers.mimeType(outputType)
                    var charset = mime.charsets.lookup(mimeType)
                    var body = helpers.cssError(locals)
                    rsp.statusCode = 200
                    rsp.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''))
                    rsp.setHeader('Content-Length', Buffer.byteLength(body, charset));
                    rsp.end(body)
                } else {
                    terraform.root(__dirname + "/templates").render("error.jade", locals, function(err, body) {
                        var mimeType = helpers.mimeType('html')
                        var charset = mime.charsets.lookup(mimeType)
                        rsp.statusCode = 500
                        rsp.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''))
                        rsp.setHeader('Content-Length', Buffer.byteLength(body, charset));
                        rsp.end(body)
                    })
                }
            } else {
                // 404
                if (!body) return next()

                //var formatted = html.prettyPrint(body)
                var formatted = beautify_html(body, { indent_size: 2 })
                var outputType = terraform.helpers.outputType(sourceFile)
                var mimeType = helpers.mimeType(outputType)
                var charset = mime.charsets.lookup(mimeType)
                rsp.statusCode = 200
                rsp.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''))
                rsp.setHeader('Content-Length', Buffer.byteLength(formatted, charset));
                rsp.end(formatted);
            }
        })
    }
}
//harp.middleware.process = custom_process;

var hosts = ['localhost',
    'joelvaneenwyk.com',
    'www.joelvaneenwyk.com',
    'www.joeltest.com',
    'jvaneenwyk.com',
    'www.jvaneenwyk.com',
    '*.herokuapp.com'
]

views = harp.mount(siteRoot + "views")
var dictionary = [
    ["/", serveStatic(siteRoot + siteData)],
    ["/", favicon(siteRoot + siteData + '/favicon.ico')],
    ["/", serveStatic(siteRoot + 'data')],
    ["/", harp.mount(siteRoot + "views")],
    ["/play", serveStatic(siteRoot + 'data')],
    ["/thirdparty", serveStatic(siteRoot + "thirdparty")]
]

console.log('Starting up Joel Van Eenwyk app');

app.route('/')

for (var i = 0; i < dictionary.length; i++) {
    for (var j = 0; j < hosts.length; j++) {
        var path = dictionary[i][0];
        var func = dictionary[i][1];
        var host = hosts[j];
        app.use(path, vhost(host, func));
    }
}

module.exports = app;
