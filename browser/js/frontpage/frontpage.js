app.config(function ($stateProvider) {
    $stateProvider.state('frontpage', {
        url: '/',
        templateUrl: 'js/frontpage/frontpage.html',
        controller: 'FrontPageCtrl'
    });
});

app.controller('FrontPageCtrl', function ($scope, Socket){
  console.log('hey');
  $scope.createUserName = function () {
    Socket.emit('clnEveGuestLobby');
  }
});
