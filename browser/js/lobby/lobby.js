app.config(function($stateProvider) {
    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html',
        controller: 'LobbyCtrl'
    });
});

app.controller('LobbyCtrl', function($scope, $state, Socket) {

    $scope.waiting = true;
    $scope.$on('$destroy', function(){
        Socket.removeListener('users', usersFunc);
        Socket.removeListener('sendingmsg', sendingmsgFunc);
        Socket.removeListener('noMatch', noMatchFunc);
        Socket.removeListener('closeModals', closeModalsFunc);
        Socket.removeListener('gameStart', gameStartFunc);
    })

    $scope.initModals = function() {
        $('.modal-trigger').leanModal(); // Initialize the modals
    };

    Socket.emit('getUsers');

    Socket.on('users', usersFunc);
    function usersFunc(payload) {
        $scope.activeUsers = payload.users;
        $scope.$evalAsync();
    }

    $scope.challengeUser = function(user) {
        Socket.emit('challengeUser', { id: user.id });
        $scope.opponent = user;
        $('#waitingForUser').openModal();
        $scope.$evalAsync();
    };

    Socket.on('sendingmsg', sendingmsgFunc);
    function sendingmsgFunc(payload) {
       $scope.challenger = payload.sender;
       $('#challengeUser').openModal();
       $scope.$evalAsync();
    }

    $scope.challengeAccepted = function() {
        Socket.emit('challengeAccepted', { id: $scope.challenger.id });
    };

    $scope.challengeRejected = function() {
        Socket.emit('challengeRejected', { id: $scope.challenger.id });
        $scope.challenger = null;
    };

    Socket.on('noMatch', noMatchFunc);
    function noMatchFunc () {
        $scope.waiting = false;
        $scope.$evalAsync();
    }

    // Ran: Hotfix for lingering modal background when challenging users.
    Socket.on('closeModals', closeModalsFunc);
    function closeModalsFunc() {
        $('#challengeUser').closeModal();
        $('#waitingForUser').closeModal();
    }

    // Ran: Hotfix for lobby state using frontpage state controller's
    // 'gameStart' event listener to move both players into the game.
    // As a side effect, game doesn't start if players go directly to
    // lobby URL (eg. http://localhost:1337/lobby)

    Socket.on('gameStart', gameStartFunc);
    function gameStartFunc(payload) {
        $state.go('game', { gameId: payload.room });
    }
});


app.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        if (scope.$last) { // all are rendered
            scope.$eval(attrs.repeatDone);
        }
    }
});
