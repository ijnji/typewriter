
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

const shortid = require('shortid');


const orgLength = dictionaryUtils.orgLength
const DictObj = dictionaryUtils.DictObj
const WordOutput = dictionaryUtils.wordOutput

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
        }, 3000);

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

    let wordTime = 0
    let wordInterval = setInterval(function(){
      let word = randomWord();

      io.emit('eveSrvWord', {word: word})
    }, 1000);

    let diffuclty  = 0;
    const diffInterval = setInterval(function() {
        diffuclty++
        const words = WordOutput(diffuclty)
        io.emit('eventDiff',{words: words})
    },60000)


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
        // console.log('socket session: ', socket.handshake.session);

        socket.on('randomMatch', function(){
          findOrCreateRoom(socket);

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
                orgLength();
                console.log("fun",DictObj)
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
          const payload = {id: socket.id, key: event.key};
          io.to(socket.currGame).emit('eveSrvKey', payload);
        });
        socket.on('eveClnGameOver', function(){
          if(socket.currGame){
            const room = socket.currGame;
            delete socket.currGame;
            clearInterval(roomToWordInterval[room]);
            delete roomToWordInterval[room];
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


});
}
// ======
// };




