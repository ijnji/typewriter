app.config(function($stateProvider) {
    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html',
        controller: 'LobbyCtrl'
    });
});

app.controller('LobbyCtrl', function($scope, $state, Socket) {

    $scope.waiting = true;


    $scope.initModals = function() {
        $('.modal-trigger').leanModal(); // Initialize the modals
    };

    Socket.emit('getUsers');

    Socket.on('users', function(payload) {
        $scope.activeUsers = payload.users;
        $scope.$evalAsync();
    });

    $scope.challengeUser = function(user) {
        Socket.emit('challengeUser', { id: user.id });
        $scope.opponent = user;
        $('#waitingForUser').openModal();
        $scope.$evalAsync();
    };

    Socket.on('sendingmsg', function(payload) {
        $scope.challenger = payload.sender;
        $('#challengeUser').openModal();
        $scope.$evalAsync();
    });

    $scope.challengeAccepted = function() {
        Socket.emit('challengeAccepted', { id: $scope.challenger.id });
    };

    $scope.challengeRejected = function() {
        Socket.emit('challengeRejected', { id: $scope.challenger.id });
        $scope.challenger = null;
    };

    Socket.on('noMatch', function() {
        $scope.waiting = false;
        $scope.$evalAsync();
    });

    Socket.on('yesMatch', function() {

    });

    // Ran: Hotfix for lingering modal background when challenging users.
    Socket.on('closeModals', function() {
        $('#challengeUser').closeModal();
        $('#waitingForUser').closeModal();
    });

    // Ran: Hotfix for lobby state using frontpage state controller's
    // 'gameStart' event listener to move both players into the game.
    // As a side effect, game doesn't start if players go directly to
    // lobby URL (eg. http://localhost:1337/lobby)
    Socket.on('gameStart', function(payload) {
        $state.go('game', { gameId: payload.room });
    });
});


app.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        if (scope.$last) { // all are rendered
            scope.$eval(attrs.repeatDone);
        }
    }
});
