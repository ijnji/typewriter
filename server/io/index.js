'use strict';
var socketio = require('socket.io');
var chalk = require('chalk');
var io = null;
const DICT = require('../dictionary');
console.log('DICT',DICT);
module.exports = function(server) {

    let socketToRoom = {};

    if (io) return io;

    io = socketio(server);

    io.on('connection', function(socket) {
        // Now have access to socket, wowzers!
        console.log(chalk.magenta(socket.id + ' has connected'));

        socket.on('eventClientJoinGame', function(msg) {
            if (msg.gameId) {
                console.log(chalk.magenta(socket.id + ' joins room ' + msg.gameId));
                socketToRoom[socket.id] = msg.gameId;
                socket.join(msg.gameId);
            }
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
          let key = event.key;
        })

        socket.on('disconnect', function() {
            console.log(chalk.magenta(socket.id + ' has disconnected'));
        });
    });

    return io;

};
