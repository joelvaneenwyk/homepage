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

// Override the process call and format the HTML after processing it
harp.middleware.process = custom_process;

var hosts = ['localhost',
    'joelvaneenwyk.com',
    'www.joelvaneenwyk.com',
    'joel.com',
    'www.joel.com',
    'joel',
    'jvaneenwyk.com',
    'www.jvaneenwyk.com',
    '*.herokuapp.com'
]

views = harp.mount(siteRoot + "views")
var dictionary = [
    ["/", serveStatic(siteRoot + siteData)],
    ["/", favicon(siteRoot + siteData + '/favicon.ico')],
    ["/", serveStatic(siteRoot + 'data')],
    ["/", harp.mount(siteRoot + "views")]
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

var request = require("request")
var qs = require("qs")

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// Define API credentials callback URL
var callbackURL = "http://" + process.env.OPENSHIFT_APP_DNS + "/oauth2callback"
  , CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  , CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, callbackURL);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
  'https://www.googleapis.com/auth/plus.me'
];

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes // If you only need one scope you can pass it as string
});

// Initialize our oauth variables used to store access_token and related data
var state = ''
  , access_token = ''
  , token_type = ''
  , expires = '';


// Start the OAuth flow by generating a URL that the client (index.html) opens
// as a popup. The URL takes the user to Google's site for authentication
app.get("/login", function(req, res) {
    // Generate a unique number that will be used to check if any hijacking
    // was performed during the OAuth flow
    state = Math.floor(Math.random() * 1e18);

    var params = {
        response_type: "code",
        client_id: CLIENT_ID,
        redirect_uri: callbackURL,
        state: state,
        display: "popup",
        scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
    };

    params = qs.stringify(params);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(url);
});

// The route that Google will redirect the popup to once the user has authed.
// The data passed back will be used to retrieve the access_token
app.get("/oauth2callback", function(req, res) {

    // Collect the data contained in the querystring
    var code = req.query.code
      , cb_state = req.query.state
      , error = req.query.error;

    // Verify the 'state' variable generated during '/login' equals what was passed back
    if (state == cb_state) {
        if (code !== undefined) {

            // Setup params and URL used to call API to obtain an access_token
            var params = {
                code: code,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: callbackURL,
                grant_type: "authorization_code"
            };
            var url = "https://accounts.google.com/o/oauth2/token";

            // Send the API request
            request.post(url, {form: params}, function(err, resp, body) {

                // Handle any errors that may occur
                if (err) return console.error("Error occured: ", err);
                var results = JSON.parse(body);
                if (results.error) return console.error("Error returned from Google: ", results.error);

                // Retrieve and store access_token to session
                access_token = results.access_token;
                token_type = results.token_type;
                expires = results.expires_in;

                console.log("Connected to Google");

                // Close the popup. This will trigger the client (index.html) to redirect
                // to '/user' which will test out the access_token.
                var output = '<html><head></head><body onload="window.close();">Close this window</body></html>';
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(output);
            });
        } else {
            console.log("Code is undefined: " + code);
            console.log("Error: " + error);
        }
    } else {
        console.log('Mismatch with variable "state". Redirecting to /');
        res.redirect("/");
    }
});

// Test out the access_token by making an API call
app.get("/user", function(req, res) {

    // Check to see if user as an access_token first
    if (access_token) {

        // URL endpoint and params needed to make the API call
        var url = "https://www.googleapis.com/oauth2/v1/userinfo";
        var params = {
            access_token: access_token
        };

        // Send the request
        request.get({url: url, qs: params}, function(err, resp, user) {
            // Check for errors
            if (err) return console.error("Error occured: ", err);

            // Send output as response
            var output = "<h1>Your User Details</h1><pre>" + user + "</pre>";
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(output);
        });
    } else {
        console.log("Couldn't verify user was authenticated. Redirecting to /");
        res.redirect("/");
    }
});

module.exports = app;
