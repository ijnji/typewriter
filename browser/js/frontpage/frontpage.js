app.config(function($stateProvider) {
    $stateProvider.state('frontpage', {
        url: '/',
        templateUrl: 'js/frontpage/frontpage.html',
        controller: 'FrontpageCtrl'
    });
});

app.controller('FrontpageCtrl', function($scope, $state, Socket, AudioFactory) {

    Socket.emit('addGuest');

    document.onkeydown = function (e) {
        AudioFactory.play('singletype');
    }

    $scope.randomMatch = function() {
        console.log('request randomMatch');
        $scope.searching = true;
        Socket.emit('randomMatch');
    };

    Socket.on('gameStart', function(payload) {
        $state.go('game', { gameId: payload.room });
    });

});
