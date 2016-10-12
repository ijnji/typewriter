var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
let store = null;

module.exports = function (db) {

    if (store) return store;

    store = new SequelizeStore({
        db: db
    });

    store.sync();
    
    return store;

};
