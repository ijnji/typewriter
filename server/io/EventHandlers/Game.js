const dictionaryUtils = require('../../dictionary');

const randomWord = dictionaryUtils.randomWord;
const orgLength = dictionaryUtils.orgLength
const DictObj = dictionaryUtils.DictObj
const WordOutput = dictionaryUtils.wordOutput

const Game = function(app, socket, io){
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.roomToWordInterval = {};
    this.handler = {
        keypress: keypress.bind(this),
        wordHit: wordHit.bind(this),
        wordMiss: wordMiss.bind(this)
    }
}

function keypress(payload){
    this.io.to(this.socket.currGame).emit('newKey', payload);
}

function wordHit(){
    this.io.to(this.socket.currGame).emit('wordHit', {playerId: this.socket.id});
}

function wordMiss(){
    this.io.to(this.socket.currGame).emit('wordMiss', {playerId: this.socket.id});
}

module.exports = Game;
