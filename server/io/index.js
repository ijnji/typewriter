'use strict';
const socketio = require('socket.io');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passportSocketIo = require("passport.socketio");
const chalk = require('chalk');
const dictionaryUtils = require('../dictionary');
const DICT = dictionaryUtils.DICT;
const randomWord = dictionaryUtils.randomWord;
const cookieParser = require('cookie-parser');
const db = require('../db');
const createSessionStore = require('../app/configure/authentication/createSessionStore');
const socketFunctions = require('./SocketHelpers');

let io = null;

const activeUsers = [];

module.exports = function(server) {

    let socketToRoom = {};

    if (io) return io;

    io = socketio(server);

    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        secret:'Optimus Prime is my real dad',
        store: createSessionStore(db),
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));

    function onAuthorizeSuccess(data, accept){
        console.log('successful connection to socket.io');
        accept();
    }

    function onAuthorizeFail(data, message, error, accept){
      if(error)
        accept(new Error(message));
    }

    io.on('connection', function(socket) {

        // Now have access to socket, wowzers!
        console.log(chalk.magenta(socket.id + ' has connected'));

        socket.on('clnEveGuestLobby', function () {
            socketFunctions.addGuest(socket);
            console.log('ere', socketFunctions.activeUsers);
        });

        socket.on('clnEveUserLobby', function () {
            socketFunctions.addUser(socket);
            console.log('fsfsfs', socketFunctions.activeUsers);
        });

        // socket.emit('eveClnLobby', {users: socketFunctions.activeUsers})
        socket.on('getUsers', function(){
            console.log('hello');
            console.log(socketFunctions.activeUsers);
            socket.emit('users', {users: socketFunctions.activeUsers})
        })
        socket.on('eventClientJoinGame', function(msg) {
            if (msg.gameId) {
                console.log(chalk.magenta(socket.id + ' joins room ' + msg.gameId));
                socketToRoom[socket.id] = msg.gameId;
                socket.join(msg.gameId);
            }
        });
        setInterval(function(){
          let word = randomWord();
          io.emit('eveSrvWord', {word: word})
        }, 6000);
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

        socket.on('disconnect', function() {
            console.log(chalk.magenta(socket.id + ' has disconnected'));
        });
    });


    return io;

};



