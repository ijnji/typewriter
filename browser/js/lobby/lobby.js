app.config(function ($stateProvider) {
  $stateProvider.state('lobby', {
    url: '/lobby',
    templateUrl: 'js/lobby/lobby.html',
    controller: 'LobbyCtrl'
  });
});

app.controller('LobbyCtrl', function ($scope, Socket){

  $scope.waiting = true;


  $scope.initModals = function() {
    $('.modal-trigger').leanModal(); // Initialize the modals
  }

  Socket.emit('getUsers');

  Socket.on('users', function(payload){
    $scope.activeUsers = payload.users;
    $scope.$evalAsync();
  })

  $scope.challengeUser = function (user){
    Socket.emit('challengeUser', {id: user.id});
    $scope.opponent = socket;
    $('#waitingForUser').openModal();
    $scope.$evalAsync();
  }
  Socket.on('sendingmsg', function (payload){
    $scope.challenger = payload.sender;
     $('#challengeUser').openModal();
     $scope.$evalAsync();
  });

  $scope.challengeAccepted = function () {
    console.log('challenge accepted!!')
    console.log($scope.challenger);
    Socket.emit('challengeAccepted', {id: $scope.challenger.id});
  };

  $scope.challengeRejected = function () {
    console.log('challenge rejected');
    Socket.emit('challengeRejected', {id: $scope.challenger.id});
    $scope.challenger = null;
  }

  Socket.on('noMatch', function () {
    $scope.waiting = false;
    $scope.$evalAsync();
  })

  Socket.on('yesMatch', function () {

  })
});


app.directive('repeatDone', function() {
  return function(scope, element, attrs) {
    if (scope.$last) { // all are rendered
        scope.$eval(attrs.repeatDone);
    }
}
});
