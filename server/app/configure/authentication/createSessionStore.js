var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
let middleware = null;

module.exports = function (db) {

    if (middleware) return middleware;

    let store = new SequelizeStore({
        db: db
    });

    middleware = session({
        secret: 'Optimus Prime is my real dad',
        store: store,
        resave: true,
        saveUninitialized: true
    });

    store.sync();

    return middleware;

};
