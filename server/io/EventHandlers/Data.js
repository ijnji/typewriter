const Data = function(socket, io) {
    this.socket = socket;
    this.io = io;
    this.roomToWordInterval = {};
    this.handler = {
        saveMatchData: saveMatchData.bind(this)
    }
}

module.exports = Data;

function saveMatchData(payload) {
    console.log('MATCH DATA', payload);
    const winnerSocket = this.io.sockets.connected[payload.winnerInfo.socketId];
    const loserSocket = this.io.sockets.connected[payload.loserInfo.socketId];
    winnerSocket.join('lobby');
    loserSocket.join('lobby');
    this.io.to('lobby').emit('newUserInLobby', {user: winnerSocket.request.user});
    this.io.to('lobby').emit('newUserInLobby', {user: loserSocket.request.user});
}
