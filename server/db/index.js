'use strict';
var db = require('./_db');
var User = require('./models/user');
var Match = require('./models/match');
module.exports = db;

Match.belongsTo(User, {as: 'winner'});
Match.belongsTo(User, {as: 'loser'});
// eslint-disable-next-line no-unused-vars
