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
var Promise = require('sequelize').Promise;
var _ = require('lodash');

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password',
            username: 'fsa',
            longestStreak: 100,
            wins: 75,
            losses: 25,
            averageAccuracy: .7362
        },
        {
            email: 'obama@gmail.com',
            password: 'potus',
            username: 'obama',
            longestStreak: 999,
            wins: 200,
            losses: 0,
            averageAccuracy: 1
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};


function randMatch () {
    return Match.build({
        winnerId: 2,
        winnerAccuracy: _.random(1, true),
        winnerStreak: _.random(1, 84),
        loserId: 1,
        loserAccuracy: _.random(1, true),
        loserStreak: _.random(1, 70)
    })
}



var seedMatches = function () {
    var matches = [{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },{
        winnerId: 2,
        winnerAccuracy: 1,
        winnerStreak: 1,
        loserId: 1,
        loserAccuracy: .6,
        loserStreak: .8,
    },
    ]
}
db.sync({ force: true })
    .then(function () {
        return seedUsers();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
