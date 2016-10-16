
app.config(function($stateProvider) {
    $stateProvider.state('game', {
        url: '/game/:gameId',
        templateUrl: 'js/game/game.html',
        controller: 'GameCtrl'
    });
});


app.controller('GameCtrl', function() {
});
