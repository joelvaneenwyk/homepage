/*jslint node: true */
"use strict";

const url = require('url');
const pg = require('pg');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const format = require('string-template');
const express = require('express');
const enforce = require('express-sslify');

// Variables for postgres
var pgPool;
var client;
var databaseConnected = false;
var serverRoot = path.normalize(__dirname);

function setupApp(app, root, next) {

  if (databaseConnected) {
    app.use(session({
      store: new pgSession({
        pool: pgPool,
        tableName: 'session'
      }),
      unset: 'destroy',
      saveUninitialized: true,
      secret: process.env.COOKIE_SECRET,
      resave: true,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
    }));
  }

  app.use(passport.initialize());

  passport.serializeUser(function (user, done) {
    done(null, { id: user.id, login: user.login, avatar_url: user.avatar_url, accessToken: user.accessToken });
  });

  passport.deserializeUser(function (user, done) {
    if (databaseConnected) {
      // This is called to return a user from a passport
      // stategy (e.g., after user logs in with GitHub)
      // This also is what req.user is set to
      var sql = fs.readFileSync(serverRoot + '/postgres/find_user.sql').toString();
      var sql_var = format(sql, {
        profile_id: user.id
      });
      client.query(sql_var, function (err) {
        done(err, user);
      });
    }
  });

  if (process.env.GOOGLE_CLIENT_ID !== "" &&
    process.env.GOOGLE_CLIENT_SECRET !== "") {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.DEFAULT_URL + "/auth/google/callback"
    },
      function (accessToken, refreshToken, profile, done) {
        if (databaseConnected) {
          // we make sure we are always using strings for our internal ids
          var profileId = profile.id + "";
          var sql = fs.readFileSync(serverRoot + '/postgres/find_user.sql').toString();
          var sql_var = format(sql, {
            profile_id: profileId
          });
          client.query(sql_var, function (err, result) {
            if (err || result.rows.length === 0) {
              profile._id = profileId;
              var user = profile._json;
              var create_sql = fs.readFileSync(serverRoot + '/postgres/create_user.sql').toString();
              var create_sql_var = format(create_sql, {
                profile_id: profileId,
                login: user.url,
                avatar_url: user.image.url,
                accessToken: accessToken
              });
              client.query(create_sql_var, function (err) {
                profile.login = user.url;
                profile.avatar_url = user.image.url;
                profile.accessToken = accessToken;
                return done(err, profile);
              });
            } else {
              profile.accessToken = accessToken;
              profile.login = profile._json.url;
              profile.avatar_url = profile.photos[0].value;
              return done(err, profile);
            }
          });
        }
      }
    ));

    app.get('/auth/google', function (req, res, next) {
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
      passport.authenticate('google', { failureRedirect: '/' }),
      function (req, res) {
        var output =
          '<html lang="en-US">\n' +
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
  }

  app.use(passport.session());

  app.get('/auth/logout', function (req, res, next) {
    req.logout();
    req.session.destroy(function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });

  app.get("/db/status", function (req, res) {
    res.send(databaseConnected);
  });

  app.get('/api/me', function (req, res) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // this is safe as it is just the user id, login name and avatar url
    var user;
    if (req.session.passport) user = req.session.passport.user;
    if (!user) return res.send({});
    res.send({ id: user.id, login: user.login, avatar_url: user.avatar_url });
  });

  var validateSessionInitialize = function (req, path) {
    if (req.session.private === undefined) {
      req.session.private = {};
    }

    if (req.session.private[path] === undefined) {
      req.session.private[path] = {
        authenticated: false
      };
    }
  };

  app.use("/api/delete_users",
    function () {
      var sqlUsers = fs.readFileSync(serverRoot + '/postgres/delete_users.sql').toString();
      client
        .query(sqlUsers,
          function (err, result) {
            if (err) {
              console.log('Failed to delete user table');
            } else {
              console.log('Deleted user table');
              console.log(result);
            }
          });
    });

  // Special API call to flush the session
  app.use("/api/session/kill",
    function (req, res) {
      if (req.session !== undefined) {
        req.session.private = {};
        req.session.save();
        delete req.session;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end("done");
    });

  // For each folder in the private directory, setup requests to handle
  // the login and validation procedure.
  // #todo Read JSON file in root and grab passwords associated with it
  var privatePath = path.join(root, 'private');
  fs.readdir(privatePath, function (err, dirs) {
    if (err) {
      log.writeln(err.stack);
    }
    dirs.forEach(function (dir) {
      app.use("/p/" + dir + "/login",
        function (req, res, next) {
          validateSessionInitialize(req, dir);
          if (req.session.private[dir].authenticated)
            res.redirect("/p/" + dir);
          else
            next();
          return;
        }, express.static(privatePath + "/" + dir + "/login.html"));

      app.use("/p/" + dir + "/validate",
        function (req, res) {
          validateSessionInitialize(req, dir);
          req.session.private[dir].authenticated = true;
          var result = {
            authenticated: req.session.private[dir].authenticated,
            redirect: "/p/" + dir
          };
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        });

      app.use("/p/" + dir,
        function (req, res, next) {
          validateSessionInitialize(req, dir);

          if (!req.session.private[dir].authenticated) {
            res.redirect("/p/" + dir + "/login");
          } else {
            next();
          }
        }, express.static(privatePath + "/" + dir + "/index.html"));

      return;
    });
    next();
  });

  console.log('Authentication setup complete!');
}

function setupDatabase(app, root, next) {
  var nextStep = function () { setupApp(app, root, next); };

  if (client !== undefined) {
    console.log('Connected to postgres!');
    databaseConnected = true;

    var sqlUsers = fs.readFileSync(serverRoot + '/postgres/create_users.sql').toString();
    client
      .query(sqlUsers,
        function (err, result) {
          if (err) {
            console.log('Failed to create user table');
          } else {
            console.log('Created user table');
            console.log(result);
          }
          var sqlSessions = fs.readFileSync(serverRoot + '/postgres/create_session.sql').toString();
          client.query(sqlSessions,
            function (err, result) {
              if (err) {
                console.log('Session table already exists');
              } else {
                console.log('Successfully created session table');
                console.log(result);
              }
              nextStep();
            });
        });
  } else {
    nextStep();
  }
}

function getPostgresConfig(connection, ssl) {
  var config = null;

  if (connection) {
    const params = url.parse(connection);
    const auth = params.auth.split(':');

    config = {
      user: auth[0],
      password: auth[1],
      host: params.hostname,
      port: params.port,
      database: params.pathname.split('/')[1],
      ssl: ssl
    };
  }

  return config;
}

function setup(app, root, next) {
  if (process.env.USE_SECURE !== undefined && process.env.USE_SECURE === true) {
    console.log('Forcing HTTPS...');
    app.use(enforce.HTTPS());
  }

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  pgPool = new pg.Pool(getPostgresConfig(process.env.PG_REMOTE_URL));
  pgPool.connect()
    .then(remoteClient => {
      console.log("Connected to remote postgres server.");
      client = remoteClient;
      setupDatabase(app, root, next);
    })
    .catch(err => {
      if (err) {
        log.writeln(err.stack);
      }
      pgPool = new pg.Pool(getPostgresConfig(process.env.PG_LOCAL_URL));
      pgPool.connect().then(localClient => {
        console.log("Connected to local postgres server.");
        client = localClient;
        setupDatabase(app, root, next);
      })
        .catch(errconnect => {
          if (errconnect) {
            log.writeln(errconnect.stack);
          }
          console.log("No postgres server found.");
          setupDatabase(app, root, next);
        });
    });
}

module.exports = {
  setup: setup
};
