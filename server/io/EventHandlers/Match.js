const shortid = require('shortid');
const wordEmitter = require('../wordEmitter');
const dictionaryUtils = require('../../dictionary');
const _ = require('lodash');

const Match = function(app, socket, io, activeUsers) {
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.activeUsers = activeUsers;
    this.handler = {
        testMatch: testMatch.bind(this),
        randomMatch: randomMatch.bind(this),
        gameOver: gameOver.bind(this),
        stopMatch: stopMatch.bind(this)
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

//when user closes out of searching for player
function stopMatch() {
    var room = this.socket.currGame
    if (room) {
        this.socket.leave(room);
        this.socket.currGame = null;
        delete(this.socket.rooms[room]);
    }
}

function randomMatch() {
    if (openRooms.length) {
        const room = openRooms.shift();
        this.socket.join(room);
        this.socket.currGame = room;
        let players = this.io.sockets.adapter.rooms[room].sockets;
        let usersArr = [];
        _.forOwn(players, function(v, k) {
            usersArr.push(k);
        })
        var player1 = _.find(this.activeUsers, function(user) {
            return user.id === usersArr[0];
        });
        var player2 = _.find(this.activeUsers, function(user) {
            return user.id === usersArr[1];
        });
        this.io.sockets.in(room).emit('gameStart', { room: room, player1: player1, player2: player2 });
        wordEmitter.emitWords(room, this.io);
    } else {
        const room = shortid.generate();
        this.socket.join(room);
        this.socket.currGame = room;
        openRooms.push(room);
    }
}

function gameOver() {
    if (this.socket.currGame) {
        const room = this.socket.currGame;
        delete(this.socket.rooms[room]);
        // delete this.socket.currGame;
        this.socket.currGame = undefined;
        let self = this;
        let idx = _.findIndex(this.activeUsers, function(el) {
            return el.id === self.socket.id;
        });
        this.activeUsers[idx].playing = false;
        wordEmitter.stopWords(room);
        this.io.to(room).emit('endGame', { loserId: this.socket.id });
    }
}

module.exports = Match;
