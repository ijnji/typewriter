const db = require('../../db/_db');
const User = db.model('user');
const Match = db.model('match');
const Data = function(socket, io) {
    this.socket = socket;
    this.io = io;
    this.roomToWordInterval = {};
    this.handler = {
        saveMatchData: saveMatchData.bind(this)
    }
}

module.exports = Data;

function saveMatchData(payload) {
    console.log('MATCH DATA', payload);
    const winnerSocket = this.socket;
    const loserSocket = this.io.sockets.connected[payload.loserInfo.socketId];
    winnerSocket.join('lobby');
    loserSocket.join('lobby');
    this.io.to('lobby').emit('getUsers');

    //if both users are authenticated, save the match data and update their stats
    if(payload.winnerInfo.id && payload.loserInfo.id){
        createMatchandUpdateStats(payload);
    }
}

function createMatchandUpdateStats(payload){
    console.log('SAVING MATCH DATA');
    const winnerTotalWords = payload.winnerStats.totalWordsTyped;
    const loserTotalWords = payload.loserStats.totalWordsTyped;

    const winnerAccuracy = winnerTotalWords === 0 ? 0 : payload.winnerStats.correctWordsTyped / payload.winnerStats.totalWordsTyped;
    const winnerStreak = payload.winnerStats.longestStreak;
    const winnerId = payload.winnerInfo.id;
    const loserAccuracy = loserTotalWords === 0 ? 0 : payload.loserStats.correctWordsTyped / payload.loserStats.totalWordsTyped;
    const loserStreak = payload.loserStats.longestStreak;
    const loserId = payload.loserInfo.id;
    const gameDuration = payload.duration;
    Match.create({
        winnerAccuracy: winnerAccuracy,
        winnerStreak: winnerStreak,
        winnerId: winnerId,
        loserAccuracy: loserAccuracy,
        loserStreak: loserStreak,
        loserId: loserId,
        gameDuration: gameDuration
    })
    .then(savedMatch => User.findById(winnerId))
    .then(winnerUser => winnerUser.updateStats(winnerAccuracy, winnerStreak, true))
    .then(() => User.findById(loserId))
    .then(loserUser => loserUser.updateStats(loserAccuracy, loserStreak, false));
}
