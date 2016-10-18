const shortid = require('shortid');
const wordEmitter = require('../wordEmitter');
const dictionaryUtils = require('../../dictionary');
const _ = require('lodash');
const socketUtils = require('../socketUtils');
const Game = require('./game');
const Match = function(socket, io) {
    this.socket = socket;
    this.io = io;
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
        const opponentSocket = socketUtils.getAllRoomMembers(room, this.io)[0];
        this.socket.join(room);
        this.socket.leave('lobby');
        opponentSocket.leave('lobby');
        this.io.to('lobby').emit('getUsers');
        this.socket.currGame = room;
        this.io.sockets.in(room).emit('gameStart', { room: room, player1: opponentSocket.request.user, player2: this.socket.request.user });
        wordEmitter.emitWords(room, this.io);
    } else {
        const room = shortid.generate();
        this.socket.join(room);
        this.socket.currGame = room;
        openRooms.push(room);
    }
}

function gameOver(payload) {
    if (this.socket.currGame) {
        console.log('payload for gameOver', payload);
        const rivalSocket = this.io.sockets.connected[payload.rivalSocketId];
        const room = this.socket.currGame;
        delete this.socket.rooms[room];
        this.socket.currGame = undefined;
        rivalSocket.currGame = undefined;
        wordEmitter.stopWords(room);
        Game.stopStreakWords(room);
        this.io.to(room).emit('endGame', { loserId: this.socket.id });
    }
}

module.exports = Match;
