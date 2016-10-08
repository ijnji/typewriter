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
let noMoreGame = false;

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
    } else {
        const room = shortid.generate();
        this.socket.join(room);
        this.socket.currGame = room;
        openRooms.push(room);
    }
}


function gameOver(){
    console.log('CALLING GAME OVER');
    if (this.socket.currGame) {
        console.log('currGame exists');
        const room = this.socket.currGame;
        delete this.socket.currGame;
        clearInterval(this.roomToWordInterval[room]);
        delete this.roomToWordInterval[room];
    //     var self = this;
    //     console.log(this.activeUsers);
    //     var idx = _.findIndex(this.activeUsers, function (el){
    //     return el.id === self.socket.id;
    // });
        // this.activeUsers[this.socket.id].playing = false;
        this.io.to(room).emit('endGame', { loserId: this.socket.id });
        console.log('ended game');

    }
}

module.exports = Match;
