app.service('SocketService', function ($rootScope, SocketFactory, $state){
    let Socket = SocketFactory.socket;

    let rival;
    Socket.on('gameStart', function(payload) {
        console.log(payload, $rootScope.rootScopeUser);
        rival = payload.player1.username === $rootScope.rootScopeUser.username ? payload.player2 : payload.player1;
    });
    this.loginOrLogoutHandler = function () {
        Socket.emit('loginOrLogout');
        SocketFactory.refreshSocket();
        Socket = SocketFactory.socket;
        $rootScope.$broadcast('refreshedSocket', {socket: SocketFactory.socket});
        Socket.emit('getUsers');
        $state.go('frontpage')
    }
   this.getRival = function () {
    return rival;
   }
   return this;
});
