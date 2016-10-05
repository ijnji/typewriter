
const Game = function(app, socket, io){
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.roomToWordInterval = {};
    this.handler = {
        keypress: keypress.bind(this)
    }
}

function keypress(payload){
    this.io.to(this.socket.currGame).emit('newKey', payload);
}


module.exports = Game;
