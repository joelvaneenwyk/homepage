/*jslint node: true */
"use strict";

var pg = require('pg');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var format = require('string-template');

var root = path.normalize(__dirname);

// Initialize our oauth variables used to store access_token and related data
var oauth_states = [];

// Variables for postgres
var client = new pg.Client();
var databaseConnected = false;

function setupApp(app, databaseURL, next) {
    app.use(session({
        store: new pgSession({
            pg: pg,
            conString: databaseURL,
            tableName: 'session'
        }),
        saveUninitialized: true,
        secret: process.env.COOKIE_SECRET,
        resave: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
    }));

    app.use(passport.initialize());

    passport.serializeUser(function(user, done) {
        done(null, { id: user.id, login: user.login, avatar_url: user.avatar_url, accessToken: user.accessToken });
    });

    passport.deserializeUser(function(user, done) {
        // This is called to return a user from a passport
        // stategy (e.g., after user logs in with GitHub)
        // This also is what req.user is set to
        var sql = fs.readFileSync(root + '/postgres/find_user.sql').toString();
        var sql_var = format(sql, {
            profile_id: user.id
        });
        client.query(sql_var, function(err, queryResult) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            // we make sure we are always using strings for our internal ids
            var profileId = profile.id + "";

            var sql = fs.readFileSync(root + '/postgres/find_user.sql').toString();
            var sql_var = format(sql, {
                profile_id: profileId
            });
            client.query(sql_var, function(err, result) {
                if (err || result.rows.length === 0) {
                    profile._id = profileId;
                    var user = profile._json;
                    var create_sql = fs.readFileSync(root + '/postgres/create_user.sql').toString();
                    var create_sql_var = format(create_sql, {
                        profile_id: profileId,
                        login: user.url,
                        avatar_url: user.image.url,
                        accessToken: accessToken
                    });
                    client.query(create_sql_var, function(err) {
                        profile.login = user.url;
                        profile.avatar_url = user.image.url;
                        profile.accessToken = accessToken;
                        return done(err, profile);
                    });
                } else {
                    profile.accessToken = accessToken;
                    return done(err, profile);
                }
            });
        }
    ));

    app.use(passport.session());

    app.get('/auth/google', function(req, res, next) {
        if (req.query.redirect) {
            req.session.redirectTo = req.query.redirect;
        }
        passport.authenticate('google', {
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"
            ]
        })(req, res, next);
    });

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            var output =
                '<html>\n' +
                '<head>\n' +
                '<script type="text/javascript" src="/js/login.js"></script>\n' +
                '<script>\n' +
                'function onLoad() {\n' +
                'var user={};\n' +
                'onLoginSuccess(user);\n' +
                '}\n' +
                '</script>\n' +
                '</head>\n' +
                '<body onload="onLoad();"></body>\n' +
                '</html>';
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(output);
        });

    app.get('/auth/logout', function(req, res) {
        req.logout();
        if (req.query.redirect) {
            return res.redirect(req.query.redirect);
        }
        res.redirect('/');
    });

    app.get("/db/status", function(req, res) {
        res.send(databaseConnected);
    });
    
    app.get('/api/me', function(req, res) {
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        // this is safe as it is just the user id, login name and avatar url
        var user;
        if (req.session.passport) user = req.session.passport.user;
        if (!user) return res.send({});
        res.send({ id: user.id, login: user.login, avatar_url: user.avatar_url });
    });

    app.all('/p/*', function(req, res, next) {
        if (!req.session.loggedIn) {
            res.redirect("/login");
        } else if (req.session.loggedIn) {
            next();
        }
    });

    next();
}

function setupDatabase(app, newClient, databaseURL, next) {
    console.log('Connected to postgres!');

    databaseConnected = true;

    client = newClient;

    var sqlUsers = fs.readFileSync(root + '/postgres/create_users.sql').toString();
    client
        .query(sqlUsers,
            function(err, result) {
                if (err) {
                    console.log('Failed to create user table');
                } else {
                    console.log('Created user table');
                    console.log(result);
                }
                var sqlSessions = fs.readFileSync(root + '/postgres/create_session.sql').toString();
                client.query(sqlSessions,
                    function(err, result) {
                        if (err) {
                            console.log('Session table already exists');
                        } else {
                            console.log('Successfully created session table');
                            console.log(result);
                        }
                        setupApp(app, databaseURL, next);
                    });
            });
}

function setup(app, next) {
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));

    pg.defaults.ssl = true;
    pg.connect(process.env.PG_REMOTE_URL, function(remoteErr, remoteClient) {
        if (remoteErr) {
            console.log('Failed to connect to remote postgres. Connecting to local postgres...');
            pg.defaults.ssl = false;
            pg.connect(process.env.PG_LOCAL_URL, function(localErr, localClient) {
                if (localErr) {
                    console.log('Failed to connect to local postgres');
                    console.log(localErr);
                } else {
                    setupDatabase(app, localClient, process.env.PG_LOCAL_URL, next);
                }
            });
        } else {
            setupDatabase(app, remoteClient, process.env.PG_REMOTE_URL, next);
        }
    });
}

module.exports = {
    setup: setup
};
