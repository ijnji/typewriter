'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!
        console.log('A new client has connected:' + socket.id);
        io.emit('helloworld')

        // socket.on('', function () {
        //   console.log('hi');
        //   console.log(socket.id);
        //   io.broadcast.emit('helloworld')
        // })

        // socket.on('disconnect', function () {
        //   console.log('im disconnecting');
        // });
    });

    return io;

};
