const io = ('../index.js');
const shortid = require('shortid');
const dictionaryUtils = require('../../dictionary');

const Match = function(app, socket, io){
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.roomToWordInterval = {};
    this.handler = {
        randomMatch: randomMatch.bind(this),
        gameOver:   gameOver.bind(this)
    }
}

const openRooms = [];


function randomMatch() {
    if (openRooms.length) {
        const room = openRooms.shift();
        this.socket.join(room);
        this.socket.currGame = room;
        this.io.sockets.in(room).emit('gameStart', { room: room });
        //start sending words to players in room
        // this.roomToWordInterval[room] = setInterval(function() {
        //     const word = dictionaryUtils.randomWord();
        //     io.to(room).emit('eveSrvWord', { word: word });
        // }, 3000);
    } else {
        const room = shortid.generate();
        this.socket.join(room);
        this.socket.currGame = room;
        openRooms.push(room);
    }
}

function gameOver(){
    if (this.socket.currGame) {
        const room = this.socket.currGame;
        delete this.socket.currGame;
        // clearInterval(this.roomToWordInterval[room]);
        // delete this.roomToWordInterval[room];
        io.to(room).emit('endGame', { loserId: this.socket.id });
    }
}

module.exports = Match;
