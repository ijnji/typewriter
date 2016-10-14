'use strict';
const socketio = require('socket.io');
const Match = require('./EventHandlers/Match');
const Lobby = require('./EventHandlers/Lobby');
const Game = require('./EventHandlers/Game');
const chalk = require('chalk');
const _ = require('lodash');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const db = require('../db');
const createSessionStorePassport = require('../app/configure/authentication/createSessionStorePassport');
const guestTools = require('./guestTools');
// const sharedsession = require('express-socket.io-session');

let io = null;

module.exports = function(server) {

    if (io) return io;
    io = socketio(server);

    let sessionStore = createSessionStorePassport(db);

    io.use(passportSocketIo.authorize({
        secret: 'Optimus Prime is my real dad',
        key: 'connect.sid',
        store: sessionStore,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));

    function onAuthorizeSuccess(data, accept) {
        console.log('user found');
        accept();
    }

    function onAuthorizeFail(data, message, error, accept) {
        console.log('No user found');
        accept();
    }

    io.on('connection', function(socket) {
        // Create event handlers for this socket
        console.log('user object in socket', socket.request.user);
        console.log(chalk.magenta(socket.id + ' has connected'));
        console.log(activeUsers);
        //make sure socketid matches user
        if(socket.request.user.logged_in === false){
            socket.request.user.username = guestTools.generateUsername(io);
        }
        console.log('adding username for guest');


        activeUsers.push({ id: socket.id, username: newUser, playing: false })
        console.log(activeUsers);

        //send user to frontend

        socket.emit('setUsername', { username: newUser });

        const eventHandlers = {
            match: new Match(app, socket, io, activeUsers),
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

            var i = _.findIndex(activeUsers, function(el) {
                return el.id === socket.id;
            });
            activeUsers.splice(i, 1);

            if (socket.currGame) {
                const room = socket.currGame;
                delete socket.currGame;

                // clearInterval(Match.roomToWordInterval[room]);
                // delete roomToWordInterval[room];
                io.to(room).emit('playerLeave');
            }
        });
        return io;

    });
}
