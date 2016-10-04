app.config(function ($stateProvider) {
  $stateProvider.state('lobby', {
    url: '/lobby',
    templateUrl: 'js/lobby/lobby.html',
    controller: 'LobbyCtrl'
  });
});

app.controller('LobbyCtrl', function ($scope, Socket){
  console.log('hedfdsfds');
  Socket.emit('getUsers');
  Socket.on('users', function(activeUsers){
    $scope.activeUsers = activeUsers.users;
    $scope.$digest();
    console.log('hey');
    console.log($scope.activeUsers);
  })
});
