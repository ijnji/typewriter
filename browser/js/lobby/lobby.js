// app.config(function($stateProvider) {
//     $stateProvider.state('lobby', {
//         url: '/lobby',
//         templateUrl: 'js/lobby/lobby.html',
//         //controller: 'LobbyCtrl'
//     });
// });

app.controller('LobbyCtrl', function($scope, $state, SocketFactory) {
    let Socket = SocketFactory.socket;
    $scope.$on('refreshedSocket', function(event, data) {
        Socket = data.socket;
    });
    $scope.waiting = true;
    $scope.$on('$destroy', function(){
        Socket.removeListener('users', usersFunc);
        Socket.removeListener('newChallenge', newChallengeFunc);
        Socket.removeListener('noMatch', noMatchFunc);
        Socket.removeListener('closeModals', closeModalsFunc);
        Socket.removeListener('gameStart', gameStartFunc);
        Socket.removeListener('removeUser', removeUserFunc);
    })

    $scope.initModals = function() {
        $('.modal-trigger').leanModal(); // Initialize the modals
    };
    Socket.emit('getUsers');

    Socket.on('users', usersFunc);
    function usersFunc(payload) {
        $scope.lobbyUsers = payload.users;
        $scope.$evalAsync();
    }

    Socket.on('newUserInLobby', newUserInLobbyFunc);
    function newUserInLobbyFunc(payload){
        console.log('heard new user', payload.user);
        $scope.lobbyUsers.push(payload.user);
        console.log($scope.lobbyUsers);
        $scope.$evalAsync();
    }

    Socket.on('removeUser', removeUserFunc);
    function removeUserFunc(payload){
        const usernames = $scope.lobbyUsers.map(user => user.username);
        const userIdx = usernames.indexOf(payload.user.username);
        console.log(usernames, payload.user.username);
        if (userIdx > -1) {
            $scope.lobbyUsers.splice(userIdx, 1);
            console.log('user removed');
        }
        $scope.$evalAsync();
    }

    $scope.challengeUser = function(user) {
        console.log('challenging', user.socketId);
        Socket.emit('challengeUser', { id: user.socketId });
        $scope.opponent = user;
        $('#waitingForUser').openModal();
        $scope.$digest();
    };

    Socket.on('newChallenge', newChallengeFunc);
    function newChallengeFunc(payload) {
    console.log('new challenge');
       $scope.challenger = payload.challenger;
       $('#challengeUser').openModal();
       $scope.$evalAsync();
    }

    $scope.challengeAccepted = function() {
        Socket.emit('challengeAccepted', { challenger: $scope.challenger });
        $scope.challenger = null;
    };

    $scope.challengeRejected = function() {
        Socket.emit('challengeRejected', { challenger: $scope.challenger });
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

app.directive('lobby', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'js/lobby/lobby.html',
        controller: 'LobbyCtrl',
        // link: function(scope) {
        //     scope.waiting = true;

        //     scope.initModals = function() {
        //         $('.modal-trigger').leanModal(); // Initialize the modals
        //     };

        //     Socket.emit('getUsers');

        //     Socket.on('users', function(payload) {
        //         scope.activeUsers = payload.users;
        //         scope.$evalAsync();
        //     });

        //     scope.challengeUser = function(user) {
        //         Socket.emit('challengeUser', { id: user.id });
        //         scope.opponent = user;
        //         $('#waitingForUser').openModal();
        //         scope.$evalAsync();
        //     };

        //     Socket.on('sendingmsg', function(payload) {
        //         scope.challenger = payload.sender;
        //         $('#challengeUser').openModal();
        //         scope.$evalAsync();
        //     });

        //     scope.challengeAccepted = function() {
        //         Socket.emit('challengeAccepted', { id: scope.challenger.id });
        //     };

        //     scope.challengeRejected = function() {
        //         Socket.emit('challengeRejected', { id: scope.challenger.id });
        //         scope.challenger = null;
        //     };

        //     Socket.on('noMatch', function() {
        //         scope.waiting = false;
        //         scope.$evalAsync();
        //     });

        //     Socket.on('yesMatch', function() {

        //     });

        //     // Ran: Hotfix for lingering modal background when challenging users.
        //     Socket.on('closeModals', function() {
        //         $('#challengeUser').closeModal();
        //         $('#waitingForUser').closeModal();
        //     });

        //     // Ran: Hotfix for lobby state using frontpage state controller's
        //     // 'gameStart' event listener to move both players into the game.
        //     // As a side effect, game doesn't start if players go directly to
        //     // lobby URL (eg. http://localhost:1337/lobby)
        //     Socket.on('gameStart', function(payload) {
        //         $state.go('game', { gameId: payload.room });
        //     });
        // }

    }
})
