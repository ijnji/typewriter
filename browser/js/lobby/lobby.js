app.config(function ($stateProvider) {
  $stateProvider.state('lobby', {
    url: '/lobby',
    templateUrl: 'js/lobby/lobby.html',
    controller: 'LobbyCtrl'
  });
});

app.controller('LobbyCtrl', function ($scope, Socket){

  $scope.initModals = function() {
    $('.modal-trigger').leanModal(); // Initialize the modals
  }

  Socket.emit('getUsers');

  Socket.on('users', function(activeUsers){
    console.log(activeUsers.users);
    $scope.activeUsers = activeUsers.users;
    $scope.$digest();
  })

  $scope.challengeUser = function (socketId){
    console.log('in challenge user');
    Socket.emit('challengeUser', {id: socketId});
    console.log('challenged');
  }
  Socket.on('sendingmsg', function (sender){
    console.log(sender);
    console.log('challenged user receieved message');
  });
});


app.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        if (scope.$last) { // all are rendered
            scope.$eval(attrs.repeatDone);
        }
    }
});
