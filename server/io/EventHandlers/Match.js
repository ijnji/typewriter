const shortid = require('shortid');
const dictionaryUtils = require('../../dictionary');
const _ = require('lodash');

const Match = function(app, socket, io, activeUsers){
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.roomToWordInterval = {};
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
        const word = dictionaryUtils.randomWord();
        self.io.to('test').emit('eveSrvWord', { word: word });
    }, 1000);
}

function randomMatch() {
    if (openRooms.length) {
        const room = openRooms.shift();
        this.socket.join(room);
        this.socket.currGame = room;
        this.io.sockets.in(room).emit('gameStart', { room: room });
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
        var self = this;
        var idx = _.findIndex(this.activeUsers, function (el){
        return el.id === self.socket.id;
    });
        this.activeUsers[idx].playing = false;
        this.io.to(room).emit('endGame', { loserId: this.socket.id });
    }
}

module.exports = Match;
