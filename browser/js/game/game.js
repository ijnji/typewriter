app.config(function ($stateProvider) {
    $stateProvider.state('game', {
        url: '/game',
        templateUrl: 'js/game/game.html',
        controller: 'GameCtrl'
    });
});


app.controller('GameCtrl', function ($scope, Socket) {
  Socket.on('connect', function () {
    console.log('i am connected!');
  })
  Socket.on('helloworld', function () {
    console.log('hello world');
  })
});
