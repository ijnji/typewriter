'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');
var Match = require('./match');
var db = require('../_db');
var _ = require('lodash');

module.exports = db.define('user', {
    email: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    longestStreak: {
        type: Sequelize.INTEGER
    },
    wins: {
        type: Sequelize.INTEGER
    },
    losses: {
        type: Sequelize.INTEGER
    },
    averageAccuracy: {
        type: Sequelize.FLOAT
    },
    password: {
        type: Sequelize.STRING
    },
    avatarSm: {
      type: Sequelize.STRING
    },
    avatarLg: {
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
                include: [{model: this.Model, as: 'winner'}, {model: this.Model, as: 'loser'}]
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
                if (!user.avatarSm || !user.avatarLg) {
                    const genders = ['male', 'female'];
                    const rand = _.random(0, 1);
                    user.avatarSm = `http://eightbitavatar.herokuapp.com/?id=${user.username}&s=${genders[rand]}&size=75`;
                    user.avatarLg = `http://eightbitavatar.herokuapp.com/?id=${user.username}&s=${genders[rand]}&size=150`;
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
