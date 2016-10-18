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
var faker = require('faker');

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
        avatar: faker.image.avatar(),
        username: usernames.pop(),
        longestStreak: _.random(1, 84),
        wins: _.random(0, 100),
        losses: _.random(0, 100),
        averageAccuracy: chance.floating({min: 0, max:1, fixed: 4})
    })
}


function randMatch () {
    return Match.build({
        winnerId: _.random(1, 50),
        winnerAccuracy: chance.floating({min: 0, max:1, fixed: 4}),
        winnerStreak: _.random(1, 84),
        loserId: _.random(1, 50),
        loserAccuracy: chance.floating({min: 0, max:1, fixed: 4}),
        loserStreak: _.random(1, 70),
        gameDuration: _.random (10000, 1000000)
    })
}

function generateUsers () {
    var users = doTimes(numUsers, randUser);
    users.push(User.build({
            email: 'alexander@hamilton.com',
            password: 'america',
            username: 'a_hamilton',
            avatar: '/img/userphotos/alexanderhamilton.jpg',
            longestStreak: 64,
            wins: 3,
            losses: 2,
            averageAccuracy: .9010
        }));
    users.push(User.build({
            email: 'aaron@burr.com',
            password: 'iloveduels',
            username: 'aaronburr',
            longestStreak: 65,
            avatar: '/img/userphotos/aaronburr.jpg',
            wins: 2,
            losses: 4,
            averageAccuracy: .8495
        }));
    users.push(User.build({
            email: 'randuan@ran.com',
            password: 'senpai',
            username: 'ransenpai',
            avatar: '/img/userphotos/ran.jpg',
            longestStreak: 60,
            wins: 1,
            losses: 1,
            averageAccuracy: .9582
        }));
    users.push(User.build({
            email: 'ali@ali.com',
            password: 'aliali',
            username: 'alibaba',
            avatar: '/img/userphotos/ali.jpg',
            longestStreak: 59,
            wins: 1,
            losses: 1,
            averageAccuracy: .8224
        }));
    users.push(User.build({
            email: 'theresa@theresa.com',
            password: 'tleelove',
            username: 'graduallee',
            avatar: '/img/userphotos/theresa.jpg',
            longestStreak: 54,
            wins: 2,
            losses: 0,
            averageAccuracy: .9365
        }));
    users.push(User.build({
            email: 'george@george.com',
            password: 'washington',
            username: 'curiousgeorge',
            avatar: '/img/userphotos/george.jpg',
            longestStreak: 66,
            wins: 2,
            losses: 0,
            averageAccuracy: .92715
        }));
    return users;
}

function generateMatches () {
    var matches = doTimes(numMatches, randMatch);
    matches.push(Match.build({
        winnerId: 51,
        winnerAccuracy: 1,
        winnerStreak: 55,
        loserId: 53,
        loserAccuracy: .9163,
        loserStreak: 49,
        gameDuration: 50000
    }));
    matches.push(Match.build({
        winnerId: 51,
        winnerAccuracy: .8342,
        winnerStreak: 48,
        loserId: 54,
        loserAccuracy: .7362,
        loserStreak: 47,
        gameDuration: 100000
    }));
    matches.push(Match.build({
        winnerId: 51,
        winnerAccuracy: .8343,
        winnerStreak: 64,
        loserId: 24,
        loserAccuracy: .7342,
        loserStreak: 50,
        gameDuration: 100000
    }));
    matches.push(Match.build({
        winnerId: 55,
        winnerAccuracy: .9273,
        winnerStreak: 39,
        loserId: 51,
        loserAccuracy: .9023,
        loserStreak: 40,
        gameDuration: 50000
    }));
     matches.push(Match.build({
        winnerId: 56,
        winnerAccuracy: .9445,
        winnerStreak: 51,
        loserId: 51,
        loserAccuracy: .9343,
        loserStreak: 48,
        gameDuration: 50000
    }));
     matches.push(Match.build({
        winnerId: 52,
        winnerAccuracy: .8045,
        winnerStreak: 65,
        loserId: 23,
        loserAccuracy: .3422,
        loserStreak: 10,
        gameDuration: 50000
    }));
     matches.push(Match.build({
        winnerId: 52,
        winnerAccuracy: .9342,
        winnerStreak: 51,
        loserId: 45,
        loserAccuracy: .7423,
        loserStreak: 45,
        gameDuration: 50000
    }));
     matches.push(Match.build({
        winnerId: 53,
        winnerAccuracy: 1,
        winnerStreak: 60,
        loserId: 52,
        loserAccuracy: .7324,
        loserStreak: 46,
        gameDuration: 50000
    }));
     matches.push(Match.build({
        winnerId: 54,
        winnerAccuracy: .9086,
        winnerStreak: 59,
        loserId: 52,
        loserAccuracy: .8324,
        loserStreak: 55,
        gameDuration: 50000
    }));
     matches.push(Match.build({
        winnerId: 55,
        winnerAccuracy: .9456,
        winnerStreak: 54,
        loserId: 52,
        loserAccuracy: .8932,
        loserStreak: 50,
        gameDuration: 50000
    }));
     matches.push(Match.build({
        winnerId: 56,
        winnerAccuracy: .9098,
        winnerStreak: 66,
        loserId: 52,
        loserAccuracy: .9,
        loserStreak: 43,
        gameDuration: 50000
    }));


    return matches;
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
