'use strict';
const socketio = require('socket.io');
const Match = require('./EventHandlers/Match');
const Lobby = require('./EventHandlers/Lobby');
const Game = require('./EventHandlers/Game');
const passportSocketIo = require('passport.socketio');
const chalk = require('chalk');
const _ = require('lodash');
const sharedsession = require("express-socket.io-session");

const cookieParser = require('cookie-parser');
const db = require('../db');
const createSessionStore = require('../app/configure/authentication/createSessionStore');

let io = null;

const adjectives = require('adjectives');

    let socketToRoom = {};

const activeUsers = [];

const app = {
    allSockets: []
}
const animals =  ['alpaca', 'bunny', 'cat', 'dog', 'elephant', 'fox', 'gorilla', 'hippo', 'iguana', 'jackalope', 'kangaroo', 'kakapo', 'lemur', 'monkey', 'octopus', 'penguin', 'quail', 'racoon', 'sloth', 'tiger', 'vulture', 'walrus', 'xenon', 'yak', 'zebra' ];


const nameGenerator = function(){
        const adj = _.sample(adjectives);
        const animal = _.sample(animals);
        const guestName = adj + _.capitalize(animal);
        return guestName;
    }


module.exports = function(server) {

    if (io) return io;
    io = socketio(server);

    let session = createSessionStore();

    io.use(sharedsession(session));
    //implement socket sessions soon
    // io.use(sharedsession(session));
    io.on('connection', function(socket) {
        // Create event handlers for this socket
        console.log(chalk.magenta(socket.id + ' has connected'));

        if(!socket.handshake.session.username){
            let username = nameGenerator();
            socket.handshake.session.username = username;
            socket.handshake.session.save();
        }

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
