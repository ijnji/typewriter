'use strict';
var socketio = require('socket.io');
var chalk = require('chalk');
var io = null;
const dictionaryUtils = require('../dictionary');
const DICT = dictionaryUtils.DICT;
const randomWord = dictionaryUtils.randomWord;
const orgLength = dictionaryUtils.orgLength
const DictObj = dictionaryUtils.DictObj
const rooms = require('../rooms');
const WordOutput = dictionaryUtils.wordOutput
module.exports = function(server) {

    let socketToRoom = {0: []};
    if (io) return io;
    io = socketio(server);
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

    io.on('connection', function(socket) {
        // Now have access to socket, wowzers!
        console.log(chalk.magenta(socket.id + ' has connected'));

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
          let payload = {id: socket.id, key: event.key};
          io.emit('eveSrvKey', payload);
        });
        socket.on('eveClnGameOver', function(){
          clearInterval(wordInterval);
          io.emit('eveSrvGameOver', {loserId: socket.id});
        });
        socket.on('disconnect', function() {
            console.log(chalk.magenta(socket.id + ' has disconnected'));
        });
    });

    return io;

};
