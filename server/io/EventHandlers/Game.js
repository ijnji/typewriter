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
        keypress: keypress.bind(this),
        gameStart: gameStart.bind(this),
        readyWords: readyWords.bind(this)
    }
}
function gameStart(payload) {
    
        const player1 = dictionaryUtils.wordOutput(1)
        const player2 = dictionaryUtils.wordOutput(1)

      const stuff =  {
            player1: player1,
            player2: player2
        }
        console.log("stuff", stuff)

        this.io.to(this.socket.payload.id).emit('gameStart',stuff)
        
        
    }

function readyWords(payload) {
    console.log("readyWords")
    this.socket.on('readyForActiveWords', function() {
        const player1Words = dictionaryUtils.wordOutput(1)
        const player2Words = dictionaryUtils.wordOutput(1)
        this.socket.emit('activeWords', {player1Words: player1Words, player2Words: player2Words} )
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
