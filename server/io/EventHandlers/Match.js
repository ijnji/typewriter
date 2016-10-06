const shortid = require('shortid');
const wordEmitter = require('../wordEmitter');
const Match = function(app, socket, io){
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.roomToWordInterval = {};
    this.handler = {
        testMatch: testMatch.bind(this),
        randomMatch: randomMatch.bind(this),
        gameOver:   gameOver.bind(this)
    }
}

const openRooms = [];

function testMatch() {
    const self = this;
    this.socket.join('test');
    this.socket.currGame = 'test';

}

function randomMatch() {
    if (openRooms.length) {
        const room = openRooms.shift();
        this.socket.join(room);
        this.socket.currGame = room;
        this.io.sockets.in(room).emit('gameStart', { room: room });
        console.log('gameStart emitted', room);
        wordEmitter.emitWords(room, this.io);
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
