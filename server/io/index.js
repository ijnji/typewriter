
'use strict';const socketio = require('socket.io');
const chalk = require('chalk');
const session = require('express-session');
let io = null;
const sharedsession = require('express-socket.io-session')
const dictionaryUtils = require('../dictionary');
const DICT = dictionaryUtils.DICT;
const randomWord = dictionaryUtils.randomWord;
const shortid = require('shortid');

module.exports = function(server) {

    // let socketToRoom = {};

    if (io) return io;

    io = socketio(server);

    //implement socket sessions soon
    // io.use(sharedsession(session));

    const openRooms = [];
    const roomToWordInterval = {};
    function findOrCreateRoom (socket) {
      console.log(openRooms);
      if (openRooms.length) {
        const room = openRooms.shift();
        socket.join(room);
        socket.currGame = room;
        io.sockets.in(room).emit('gameStart', {room: room});
        //start sending words to players in room
        roomToWordInterval[room] = setInterval(function(){
          const word = randomWord();
          io.to(room).emit('eveSrvWord', {word: word});
        }, 1000);

        console.log(chalk.magenta(socket.id + ' joins room and begins game ' + room));
      } else {
        const room = shortid.generate();
        socket.join(room);
        socket.currGame = room;
        openRooms.push(room);
        console.log(chalk.magenta(socket.id + ' creates room ' + room));
        console.log('myrooms',socket.rooms);
      }
    }

    io.on('connection', function(socket) {
        // Now have access to socket, wowzers!
        console.log(chalk.magenta(socket.id + ' has connected'));
        // console.log('socket session: ', socket.handshake.session);

        socket.on('randomMatch', function(){
          findOrCreateRoom(socket);
        });

        socket.on('eveClnKey', function(event){
          const payload = {id: socket.id, key: event.key};
          io.to(socket.currGame).emit('eveSrvKey', payload);
        });
        socket.on('eveClnGameOver', function(){
          if(socket.currGame){
            const room = socket.currGame;
            delete socket.currGame;
            io.to(room).emit('eveSrvGameOver', {loserId: socket.id});
          }
        });
        socket.on('disconnect', function() {
            console.log(chalk.magenta(socket.id + ' has disconnected'));
            if(socket.currGame){
              const room = socket.currGame;
              delete socket.currGame;
              clearInterval(roomToWordInterval[room]);
              delete roomToWordInterval[room];
              io.to(room).emit('playerLeave');
            }
            // console.log(io.sockets.adapter.rooms);
        });
    });

    return io;

};
