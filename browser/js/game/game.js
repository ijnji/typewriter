
app.config(function($stateProvider) {
    $stateProvider.state('game', {
        url: '/game/:gameId',
        templateUrl: 'js/game/game.html',
        controller: 'GameCtrl'
    });
});


app.controller('GameCtrl', function($scope, $state, Socket) {

    if ($state.params.gameId) {
        Socket.emit('eventClientJoinGame', {
            gameId: $state.params.gameId
        });
    }

    Socket.on('eventServerRelayOne', function() {
        let elem = document.getElementById('output');
        elem.innerHTML += '<h3>Received eventServerRelayOne</h3>';
    });

    Socket.on('eventServerRelayTwo', function() {
        let elem = document.getElementById('output');
        elem.innerHTML += '<h3>Received eventServerRelayTwo</h3>';
    });

    $scope.sendOne = function() {
        Socket.emit('eventClientOne');
    };

    $scope.sendTwo = function() {
        Socket.emit('eventClientTwo');
    };

});
