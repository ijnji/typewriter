const shortid = require('shortid');
const wordEmitter = require('../wordEmitter');
const dictionaryUtils = require('../../dictionary');
const _ = require('lodash');

const Match = function(app, socket, io, activeUsers){
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.activeUsers = activeUsers;
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
    setInterval(function() {
        self.io.to('test').emit('eveSrvWord', {
            text: dictionaryUtils.randomWord(),
            duration: 40,
            xoffset: Math.random()
        });
    }, 5000);
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
        var self = this;
        var idx = _.findIndex(this.activeUsers, function (el){
            return el.id === self.socket.id;
        });
        this.activeUsers[idx].playing = false;
        this.io.to(room).emit('endGame', { loserId: this.socket.id });
    }
}

    module.exports = Match;
