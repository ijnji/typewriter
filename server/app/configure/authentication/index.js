'use strict';
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var createSessionStorePassport = require('./createSessionStorePassport');
// var SequelizeStore = require('connect-session-sequelize')(session.Store);
var ENABLED_AUTH_STRATEGIES = [
    'local'
    // 'facebook',
    // 'google'
];

module.exports = function (app, db) {

    var User = db.model('user');

    // First, our session middleware will set/read sessions from the request.
    // Our sessions will get stored in Mongo using the same connection from
    // mongoose. Check out the sessions collection in your MongoCLI.
    app.use(session({
        secret: 'Optimus Prime is my real dad',
        store: createSessionStorePassport(db),
        resave: true,
        saveUninitialized: true
    }));

    // Initialize passport and also allow it to read
    // the request session information.
    app.use(passport.initialize());
    app.use(passport.session());

    // When we give a cookie to the browser, it is just the userId (encrypted with our secret).
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // When we receive a cookie from the browser, we use that id to set our req.user
    // to a user found in the database.
    passport.deserializeUser(function (id, done) {
        User.findById(id)
            .then(function (user) {
                done(null, user);
            })
            .catch(done);
    });

    // We provide a simple GET /session in order to get session information directly.
    // This is used by the browser application (Angular) to determine if a user is
    // logged in already.
    app.get('/session', function (req, res) {
        console.log('PASSPORT');
        if (req.user) {
            console.log('USER');
            res.send({ user: req.user.sanitize() });
        } else {
            console.log('NO USER');
            res.status(401).send('No authenticated user.');
        }
    });

    // Simple /logout route.
    app.get('/logout', function (req, res) {
        req.logout();
        res.status(200).end();
    });

    // Each strategy enabled gets registered.
    ENABLED_AUTH_STRATEGIES.forEach(function (strategyName) {
        require(path.join(__dirname, strategyName))(app, db);
    });

};
