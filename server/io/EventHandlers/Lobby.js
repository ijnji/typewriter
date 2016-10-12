const _ = require('lodash');
const shortid = require('shortid');
const wordEmitter = require('../wordEmitter');

const loginUser = function (payload) {
    const self = this;
    console.log(this.socket.username, this.activeUsers);
    if (_.isMatch(this.activeUsers, {id: this.socket.id})) {
        var idx = _.findIndex(this.activeUsers, function (el){
        return el.id === self.socket.id;
    });
        this.activeUsers.splice(idx, 1);
    }
    this.activeUsers.push({id: this.socket.id, username: payload.username, playing: false});
    };

const getUsers = function(){
    this.io.emit('users', {users: this.activeUsers});
}

const challengeUser = function(payload){
    const id = payload.id;
    const self = this;
    const challenger = _.find(this.activeUsers, function (user) {
        return user.id === self.socket.id;
    });
    this.io.to(id).emit( 'sendingmsg', {sender: challenger} );
}

const challengeAccepted = function(payload){
    const challenger = this.io.sockets.connected[payload.id];
    const self = this;
    const opponentIdx = _.findIndex(this.activeUsers, function (el){
        return el.id === self.socket.id;
    });
    const challengerIdx = _.findIndex(this.activeUsers, function (el){
        return el.id === payload.id;
    });
    const player1 = this.activeUsers[opponentIdx];
    const player2 = this.activeUsers[challengerIdx];
    const room = shortid.generate();
    this.socket.join(room);
    player1.playing = true;
    this.socket.currGame = room;
    challenger.join(room);
    player2.playing = true;
    challenger.currGame = room;
    this.io.in(room).emit('gameStart', { room: room, player1: player1, player2: player2 });
    wordEmitter.emitWords(room, this.io);

}

const challengeRejected = function(payload){
    const id = payload.id;
    this.io.to(id).emit('noMatch');

}
const Lobby = function(app, socket, io, activeUsers){
    this.activeUsers = activeUsers;
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.handler = {
        loginUser: loginUser.bind(this),
        getUsers: getUsers.bind(this),
        challengeUser: challengeUser.bind(this),
        challengeAccepted: challengeAccepted.bind(this),
        challengeRejected: challengeRejected.bind(this)
    }
}

module.exports = Lobby;
