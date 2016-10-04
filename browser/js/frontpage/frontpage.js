app.config(function($stateProvider) {
    $stateProvider.state('frontpage', {
        url: '/',
        templateUrl: 'js/frontpage/frontpage.html',
        controller: 'FrontpageCtrl'
    });
});

app.controller('FrontpageCtrl', function($scope, $state, Socket, AudioFactory) {

    $scope.createUserName = function() {
        Socket.emit('clnEveGuestLobby');
    };

    $scope.randomMatch = function() {
        console.log('request randomMatch');
        $scope.searching = true;
        Socket.emit('randomMatch');
    };

    Socket.on('gameStart', function(payload) {
        $state.go('game', { gameId: payload.room });
    });

    document.onkeydown = function (e) {
        console.log(e.keyCode);
        AudioFactory.play('singletype');
    }
});
