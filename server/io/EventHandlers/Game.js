const dictionaryUtils = require('../../dictionary');
const _ = require('lodash');

const Game = function(app, socket, io) {
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.roomToWordInterval = {};
    this.handler = {
        keypress: keypress.bind(this),
        wordHit: wordHit.bind(this),
        wordMiss: wordMiss.bind(this),
        streakWord: streakWord.bind(this)
    }
}


function keypress(payload) {
    this.io.to(this.socket.currGame).emit('newKey', payload);
}

function wordHit() {

    this.io.to(this.socket.currGame).emit('wordHit', { playerId: this.socket.id });
}

function wordMiss() {
    this.io.to(this.socket.currGame).emit('wordMiss', { playerId: this.socket.id });
}

function streakWord(payload) {
    let numberOfWords = payload.streak / 5;
    let count = 0;
    let funcIO = this.io;
    let funcSock = this.socket;
    let countWords = 0;
    while (count < numberOfWords) {
        countWords += 2000;
        let timeout = setTimeout(function() {
            const sameLengthWordArray = dictionaryUtils.dictObj[10];
            let word = sameLengthWordArray[_.random(0, sameLengthWordArray.length - 1)];
            funcIO.to(funcSock.currGame).emit('streak', { playerId: funcSock.id, streak: numberOfWords, text: word, duration: 10 });
        }, countWords);
        count += 1;
    }
}

module.exports = Game;
