/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Match = db.model('match');
var Promise = require('sequelize').Promise;
var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();
var adj = require('adjectives');

var numUsers = 50;
var numMatches = 200;

var emails = chance.unique(chance.email, numUsers);
var usernames = chance.unique(generateUsername, numUsers);


function generateUsername () {
    var part1 = _.sample(adj)
    var part2 = chance.first();
    var name = part1 + part2;
    return name;
}
function doTimes (n, fn) {
  var results = [];
  while (n--) {
    results.push(fn());
  }
  return results;
}


function randUser () {
    return User.build({
        email: emails.pop(),
        password: chance.word(),
        avatar: chance.avatar(),
        username: usernames.pop(),
        longestStreak: _.random(1, 84),
        wins: _.random(0, 100),
        losses: _.random(0, 100),
        averageAccuracy: chance.floating({min: 0, max:1, fixed: 4})
    })
}


function randMatch () {
    return Match.build({
        winnerId: _.random(1, 25),
        winnerAccuracy: chance.floating({min: 0, max:1, fixed: 4}),
        winnerStreak: _.random(1, 84),
        loserId: _.random(26, 50),
        loserAccuracy: chance.floating({min: 0, max:1, fixed: 4}),
        loserStreak: _.random(1, 70),
        gameDuration: _.random (10000, 1000000)
    })
}

function generateUsers () {
    var users = doTimes(numUsers, randUser);
    users.push(User.build({
            email: 'testing@fsa.com',
            password: 'password',
            username: 'fsa',
            longestStreak: 100,
            wins: 75,
            losses: 25,
            averageAccuracy: .7362
        }));
    users.push(User.build(        {
            email: 'obama@gmail.com',
            password: 'potus',
            username: 'obama',
            longestStreak: 999,
            wins: 200,
            losses: 0,
            averageAccuracy: 1
        }));
    return users;
}

function generateMatches () {
    return doTimes(numMatches, randMatch);
}



function createUsers () {
  return Promise.map(generateUsers(), function (user) {
    return user.save();
  });
}

function createMatches () {
  return Promise.map(generateMatches(), function (match) {
    return match.save();
  });
}

function seed () {
  return createUsers()
  .then(function () {
    return createMatches();
  });
}

db.sync({ force: true })
    .then(function () {
        return seed();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
