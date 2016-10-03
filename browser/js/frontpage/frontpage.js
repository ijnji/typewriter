app.config(function ($stateProvider) {
    $stateProvider.state('frontpage', {
        url: '/',
        templateUrl: 'js/frontpage/frontpage.html',
        controller: 'FrontpageCtrl'
    });
});

app.controller('FrontpageCtrl', function($scope, $state, Socket){
  $scope.randomMatch = function(){
    $scope.searching = true;
    Socket.emit('randomMatch');
  }
  Socket.on('gameStart', function(payload){
    console.log(payload.roomId);
    $state.go('game', {gameId: payload.room});
  });
});
