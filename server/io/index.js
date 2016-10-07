'use strict';
const socketio = require('socket.io');
const Match = require('./EventHandlers/Match');
const Lobby = require('./EventHandlers/Lobby');
const Game = require('./EventHandlers/Game');
//const session = require('express-session');
const passportSocketIo = require('passport.socketio');
const chalk = require('chalk');
const _ = require('lodash');
const dictionaryUtils = require('../dictionary');
const cookieParser = require('cookie-parser');
const db = require('../db');
const createSessionStore = require('../app/configure/authentication/createSessionStore');

let io = null;

const activeUsers = [];

const app = {
    allSockets: []
}

module.exports = function(server) {

    if (io) return io;
    io = socketio(server);

    //implement socket sessions soon
    // io.use(sharedsession(session));
    io.on('connection', function(socket) {
        // Create event handlers for this socket
        // dictionaryUtils.wordOutput(1)
        
        socket.on('readyForActiveWords', function(payload) {
            const player1Words = dictionaryUtils.wordOutput(payload.level)
            const player2Words = dictionaryUtils.wordOutput(payload.level)
            console.log(player1Words,"WOOT")
            //emit to specfic id
            socket.emit('activeWords', {player1Words: player1Words, player2Words: player2Words})

        })


        socket.on('forArray', function(payload) {
            let levelWordsKeysMe = Object.keys(payload.playerMe)
             let levelWordsKeysRival = Object.keys(payload.playerRival)
             socket.emit('makeArray', {playerMe123: levelWordsKeysMe, playerRival123: levelWordsKeysRival})
        })

        console.log(chalk.magenta(socket.id + ' has connected'));
        const eventHandlers = {
            match: new Match(app, socket, io),
            lobby: new Lobby(app, socket, io, activeUsers),
            game: new Game(app, socket, io)

        };

        // Bind events to handlers
        for (const category in eventHandlers) {
            const handler = eventHandlers[category].handler;
            for (var event in handler) {
                socket.on(event, handler[event]);
            }
        }

        // Keep track of the socket
        app.allSockets.push(socket);

        //everything below this should be in it's own EventHandler (except disconnect)
        socket.on('disconnect', function() {
            console.log(chalk.magenta(socket.id + ' has disconnected'));
            if (socket.currGame) {
                const room = socket.currGame;
                delete socket.currGame;
                // clearInterval(Match.roomToWordInterval[room]);
                // delete roomToWordInterval[room];
                io.to(room).emit('playerLeave');
            }

                var i = _.findIndex(activeUsers, function (el){
                    return el.id === socket.id;
                });
                activeUsers.splice(i, 1);
        });
        return io;

    });

    // io.use(passportSocketIo.authorize({
    //     cookieParser: cookieParser,
    //     secret: 'Optimus Prime is my real dad',
    //     store: createSessionStore(db),
    //     success: onAuthorizeSuccess,
    //     fail: onAuthorizeFail
    // }));

    // function onAuthorizeSuccess(data, accept) {
    //     accept();
    // }

    // function onAuthorizeFail(data, message, error, accept) {
    //     console.log('failed');
    //     if (error) {
    //         accept(new Error(message));
    //     }
    // }

}
