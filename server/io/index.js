'use strict';
const socketio = require('socket.io');
const Match = require('./EventHandlers/Match');
const Lobby = require('./EventHandlers/Lobby');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passportSocketIo = require("passport.socketio");
const chalk = require('chalk');

const dictionaryUtils = require('../dictionary');
const DICT = dictionaryUtils.DICT;
const randomWord = dictionaryUtils.randomWord;
const orgLength = dictionaryUtils.orgLength
const DictObj = dictionaryUtils.DictObj
const WordOutput = dictionaryUtils.wordOutput

const cookieParser = require('cookie-parser');
const db = require('../db');
const createSessionStore = require('../app/configure/authentication/createSessionStore');
const socketFunctions = require('./SocketHelpers');

let io = null;

const app = {
    allSockets: []
}

module.exports = function(server) {


    if (io) return io;
    io = socketio(server);

    //implement socket sessions soon
    // io.use(sharedsession(session));
    // let diffuclty = 0;
    // const diffInterval = setInterval(function() {
    //     diffuclty++
    //     const words = WordOutput(diffuclty)
    //     io.emit('eventDiff', { words: words })
    // }, 60000);

    io.on('connection', function(socket) {

        console.log(chalk.magenta(socket.id + ' has connected'));

        // Create event handlers for this socket
        const eventHandlers = {
            match: new Match(app, socket, io),
            lobby: new Lobby (app, socket, io)
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



        socket.on('eveClnKey', function(event) {
            const payload = { id: socket.id, key: event.key };
            io.to(socket.currGame).emit('eveSrvKey', payload);
        });

        socket.on('disconnect', function() {
            console.log(chalk.magenta(socket.id + ' has disconnected'));
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

    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        secret: 'Optimus Prime is my real dad',
        store: createSessionStore(db),
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));

    function onAuthorizeSuccess(data, accept) {
        accept();
    }

    function onAuthorizeFail(data, message, error, accept) {
        if (error)
            accept(new Error(message));
    }

}
