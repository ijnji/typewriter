const dictionaryUtils = require('../../dictionary');
const DICT = dictionaryUtils.DICT;
const orgLength = dictionaryUtils.orgLength
const DictObj = dictionaryUtils.DictObj


const Game = function(app, socket, io){
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.roomToWordInterval = {};
    this.handler = {
        keypress: keypress.bind(this)
    }
}
function gameStart(payload) {

    this.socket.on('gameStart', function() {
        const player1 = dictionaryUtils.wordOutput(1)
        const player2 = dictionaryUtils.wordOutput(1)

      const stuff =  {
            player1: player1,
            player2: player2
        }

        this.io.to(this.socket.payload.id).emit('')
        
        
    })
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
