var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('match', {
    winnerAccuracy: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    loserAccuracy: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    winnerStreak: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    loserStreak: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    gameDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        get: function() {
            let duration = this.getDataValue('gameDuration');
            const minutes = Math.floor(duration / 60000);
            const seconds = Math.floor((duration % 60000) / 1000);
            if (minutes === 0) {
                return `${seconds} seconds`;
            }
            if (seconds === 0) {
                return `${minutes} minutes`;
            }
            return `${minutes} minutes ${seconds} seconds`;
        }
    }
}, {
    instanceMethods: {
    },
    classMethods: {
    },
    hooks: {
    }
});
