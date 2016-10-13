const dictionaryUtils = require('../../dictionary');
const _ = require('lodash');

const Game = function(app, socket, io){
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.roomToWordInterval = {};
    this.handler = {
        keypress: keypress.bind(this),
        wordHit: wordHit.bind(this),
        wordMiss: wordMiss.bind(this),
        streakWord:streakWord.bind(this)
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

function streakWord (payload) {
    let numberOfWords = payload.streak/5
    let conunt = numberOfWords
    while(conunt > 0) {
        conunt-=1
            const sameLengthWordArray = dictionaryUtils.dictObj[10];
            let word = sameLengthWordArray[ _.random(0, sameLengthWordArray.length - 1 ) ];
            console.log(word)
            this.io.to(this.socket.currGame).emit('streak', {playerId: this.socket.id, streak: numberOfWords, text: word, duration: 10})
    }
}
    
 

module.exports = Game;
