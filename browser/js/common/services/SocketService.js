app.service('SocketService', function ($rootScope, SocketFactory, $state){
    let Socket = SocketFactory.socket;

    let rival;
    Socket.on('gameStart', function(payload) {
        console.log(payload, $rootScope.rootScopeUser);
       rival = payload.player1.username === $rootScope.rootScopeUser.username ? payload.player2 : payload.player1;
    });
    this.loginOrLogoutHandler = function () {
        Socket.emit('loginOrLogoutUser');
        SocketFactory.refreshSocket();
        Socket = SocketFactory.socket;
        console.log(SocketFactory.socket);
        $rootScope.$broadcast('refreshedSocket', {socket: SocketFactory.socket});
        $state.go('frontpage')
    }
   this.getRival = function () {
    return rival;
   }
   return this;
});
