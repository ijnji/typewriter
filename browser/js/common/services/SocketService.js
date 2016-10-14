app.service('SocketService', function($rootScope, Socket) {
    let rival;

    Socket.on('gameStart', function(payload) {
        rival = payload.player1.username === $rootScope.user ? payload.player2.username : payload.player1.username;
    });

    this.getRival = function() {
        return rival;
    }
    return this;
});
