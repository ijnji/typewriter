'use strict';
const socketio = require('socket.io');
const Match = require('./EventHandlers/Match');
const Lobby = require('./EventHandlers/Lobby');
const Game = require('./EventHandlers/Game');
const Data = require('./EventHandlers/Data');
const chalk = require('chalk');
const _ = require('lodash');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const db = require('../db');
const createSessionStorePassport = require('../app/configure/authentication/createSessionStorePassport');
const guestTools = require('./guestTools');
// const sharedsession = require('express-socket.io-session');

let io = null;
const allSockets = [];
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
        // console.log('user object in socket', socket.request.user);
        console.log(chalk.magenta(socket.id + ' has connected'));

        //make username and avatar if guest
        if (socket.request.user.logged_in === false) {
            socket.request.user.username = guestTools.generateUniqueGuestName(allSockets);
            socket.request.user.avatar = guestTools.generateAvatarUrl(socket.request.user.username);

        }
        else {
            const authedUser = {};
            authedUser.username = socket.request.user.username;
            authedUser.id = socket.request.user.id;
            authedUser.avatar = socket.request.user.avatar;
            authedUser.averageAccuracy = socket.request.user.averageAccuracy;
            authedUser.lognestStreak = socket.request.user.lognestStreak;
            authedUser.wins = socket.request.user.wins;
            authedUser.losses = socket.request.user.losses;
            authedUser.email = socket.request.user.email;
            socket.request.user = authedUser;
        }
        //tack on socketId to user for use in frontend
        socket.request.user.socketId = socket.id;
        // console.log('socketId',socket.request.user);
        allSockets.push(socket);


        //send user to frontend
        socket.on('setUser', function () {
            io.to(socket.id).emit('setUser', {user: socket.request.user});
        });
        io.to(socket.id).emit('setUser', {user: socket.request.user});

        //notify lobby members of new user
        console.log('before new ', socket.request.user);
        socket.join('lobby');

        io.to('lobby').emit('getUsers');

        const eventHandlers = {
            match: new Match(socket, io),
            lobby: new Lobby(socket, io, allSockets),
            game: new Game(socket, io),
            data: new Data(socket, io)
        };

        // Bind events to handlers
        for (const category in eventHandlers) {
            const handler = eventHandlers[category].handler;
            for (var event in handler) {
                socket.on(event, handler[event]);
            }
        }

        // Keep track of the socket
        allSockets.push(socket);

        //everything below this should be in it's own EventHandler (except disconnect)
        socket.on('loginOrLogout', function() {
            socket.disconnect();
        });
        socket.on('disconnect', function() {
            console.log(chalk.magenta(socket.id + ' has disconnected'));

            var idx = _.findIndex(allSockets, function(e) {
                return e.id === socket.id;
            });
            allSockets.splice(idx, 1);
            io.to('lobby').emit('getUsers');
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
