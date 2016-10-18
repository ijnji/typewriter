'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');
var Match = require('./match');
var db = require('../_db');
var _ = require('lodash');

module.exports = db.define('user', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    longestStreak: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    wins: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    losses: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    averageAccuracy: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        get: function(){
            return Math.round(this.getDataValue('averageAccuracy') * 100 ) + '%';
        }
    },
    password: {
        type: Sequelize.STRING
    },
    avatar: {
        type: Sequelize.STRING
    },
    salt: {
        type: Sequelize.STRING
    },
    twitter_id: {
        type: Sequelize.STRING
    },
    facebook_id: {
        type: Sequelize.STRING
    },
    google_id: {
        type: Sequelize.STRING
    }
}, {
    instanceMethods: {
        sanitize: function () {
            return _.omit(this.toJSON(), ['password', 'salt']);
        },
        correctPassword: function (candidatePassword) {
            return this.Model.encryptPassword(candidatePassword, this.salt) === this.password;
        },
        getMatches: function () {
            return Match.findAll({
                where: {
                    $or: [{
                        winnerId: this.id
                    }, {
                        loserId: this.id
                    }]
                },
                order: '"createdAt" DESC',
                include: [{model: this.Model, as: 'winner'}, {model: this.Model, as: 'loser'}]
            })
        },
        updateStats: function(matchAccuracy, matchStreak, isWinner){
            console.log('matchAccuracy', matchAccuracy);
            if (isWinner) {
                this.wins++;
            }
            else {
                this.losses++;
            }
            if (this.longestStreak < matchStreak) {
                this.longestStreak = matchStreak;
            }
            this.getMatches()
            .then(matches => {
                const numMatches = matches.length;
                const avgAccuracyInFloat = parseFloat(this.averageAccuracy) / 100;
                const newAvgAccuracy = (avgAccuracyInFloat * numMatches + matchAccuracy) / (numMatches + 1);
                return this.update({
                    wins: this.wins,
                    losses: this.losses,
                    longestStreak: this.longestStreak,
                    averageAccuracy: newAvgAccuracy
                })
            })
        }
    },
    classMethods: {
        generateSalt: function () {
            return crypto.randomBytes(16).toString('base64');
        },
        encryptPassword: function (plainText, salt) {
            var hash = crypto.createHash('sha1');
            hash.update(plainText);
            hash.update(salt);
            return hash.digest('hex');
        }
    },
    hooks: {
        beforeCreate: function (user) {
            if (user.changed('password')) {
                user.salt = user.Model.generateSalt();
                user.password = user.Model.encryptPassword(user.password, user.salt);
                if (!user.avatar) {
                    const genders = ['male', 'female'];
                    const rand = _.random(0, 1);
                    user.avatar = `http://eightbitavatar.herokuapp.com/?id=${user.username}&s=${genders[rand]}&size=150`;
                }
            }
        },
        beforeUpdate: function (user) {
            if (user.changed('password')) {
                user.salt = user.Model.generateSalt();
                user.password = user.Model.encryptPassword(user.password, user.salt);
            }
        }
    }
});
