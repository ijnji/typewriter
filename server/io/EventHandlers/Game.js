const dictionaryUtils = require('../../dictionary');
const DICT = dictionaryUtils.DICT;
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
        keypress: keypress.bind(this)
    }
}

function keypress(payload){
    this.io.to(this.socket.currGame).emit('newKey', payload);
}



    // let diffuclty = 0;
    // const diffInterval = setInterval(function() {
    //     diffuclty++
    //     const words = WordOutput(diffuclty)
    //     io.emit('eventDiff', { words: words })
    // }, 60000);

module.exports = Game;
