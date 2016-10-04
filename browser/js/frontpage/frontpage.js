app.config(function ($stateProvider) {
    $stateProvider.state('frontpage', {
        url: '/',
        templateUrl: 'js/frontpage/frontpage.html',
        controller: 'FrontPageCtrl'
    });
});

app.controller('FrontPageCtrl', function ($scope, Socket){
  $scope.createUserName = function () {
    console.log('createUserName function')
    Socket.emit('eveClnGuestLobby');
  }
});
