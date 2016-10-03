'use strict';
var socketio = require('socket.io');
var chalk = require('chalk');
var io = null;
const dictionaryUtils = require('../dictionary');
const DICT = dictionaryUtils.DICT;
const randomWord = dictionaryUtils.randomWord;
var findOrCreateRoom = require('../rooms').findOrCreateRoom;
var roomMap = require('../rooms').roomMap;
module.exports = function(server) {

    if (io) return io;

    io = socketio(server);
    // let wordInterval = setInterval(function(){
    //   let word = randomWord();
    //   io.emit('eveSrvWord', {word: word})
    // }, 6000);
    io.on('connection', function(socket) {

        // Now have access to socket, wowzers!
        console.log(chalk.magenta(socket.id + ' has connected'));
        socket.on('eveClnJoinGame', function() {
          let roomId = findOrCreateRoom(socket.id).toString();
          console.log(socket.roomId);
          console.log(roomMap);
          socket.join(roomId);
          var clients = io.sockets.adapter.rooms[roomId].sockets;
          //to get the number of clients in room.
          var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
          io.to(roomId).emit('eveSrvNewPlayer', {numClients: numClients})

        });

        socket.on('eventClientOne', function() {
            console.log(chalk.magenta(socket.id + ' sent eventClientOne'));
            let gameId = socketToRoom[socket.id];
            if (gameId) {
                io.to(gameId).emit('eventServerRelayOne');
            }
        });

        socket.on('eventClientTwo', function() {
            console.log(chalk.magenta(socket.id + ' sent eventClientTwo'));
            let gameId = socketToRoom[socket.id];
            if (gameId) {
                io.to(gameId).emit('eventServerRelayTwo');
            }
        });

        socket.on('eveClnKey', function(event){
          let payload = {id: socket.id, key: event.key};
          io.emit('eveSrvKey', payload);
        });
        socket.on('eveClnGameOver', function(){
          clearInterval(wordInterval);
          io.emit('eveSrvGameOver', {loserId: socket.id});
        });
        socket.on('disconnect', function() {
            so
            console.log(chalk.magenta(socket.id + ' has disconnected'));
        });
    });

    return io;

};
