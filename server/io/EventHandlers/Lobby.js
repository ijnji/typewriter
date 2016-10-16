const _ = require('lodash');
const shortid = require('shortid');
const wordEmitter = require('../wordEmitter');
const socketUtils = require('../socketUtils');

const Lobby = function(socket, io, allSockets) {
    this.socket = socket;
    this.io = io;
    this.allSockets = allSockets;
    // this.lobbySockets = socketUtils.getAllRoomMembers('lobby', this.io);
    // console.log('lobbySockets', this.lobbySockets);
    // this.lobbyUsers = this.lobbySockets.map(socket1 => socket1.request.user);
    this.handler = {
        getUsers: getUsers.bind(this),
        challengeUser: challengeUser.bind(this),
        challengeAccepted: challengeAccepted.bind(this),
        challengeRejected: challengeRejected.bind(this),
        loginOrLogoutUser: loginOrLogoutUser.bind(this)
    }
}

function getAllUsersInLobby(io) {
    const allSocketsInLobby = socketUtils.getAllRoomMembers('lobby', io);
    // console.log('allSocketsInLobby', allSocketsInLobby.map(socket => socket.request.user) );
    return allSocketsInLobby.map(socket => socket.request.user);
}

const loginOrLogoutUser = function() {
    this.socket.disconnect();
};

const getUsers = function() {
    this.io.to(this.socket.id).emit('users', { users: getAllUsersInLobby(this.io) });
}

const challengeUser = function(payload) {
    this.io.to(payload.id).emit('newChallenge', { challenger: this.socket.request.user });
}

const challengeAccepted = function(payload) {
    const challengerSocket = this.io.sockets.connected[payload.challenger.socketId];
    console.log(payload, challengerSocket);
    const room = shortid.generate();
    this.socket.join(room)
    challengerSocket.join(room);
    this.socket.leave('lobby');
    challengerSocket.leave('lobby');
    this.socket.currGame = room;
    challengerSocket.currGame = room;
    // Ran: Hotfix for lingering modal background when challenging users.
    this.io.in(room).emit('closeModals');
    this.io.in(room).emit('gameStart', { room: room, player1: challengerSocket.request.user, player2: this.socket.request.user });
    wordEmitter.emitWords(room, this.io);
}

const challengeRejected = function(payload) {
    this.io.to(payload.challenger.socketId).emit('noMatch');
}

module.exports = Lobby;
