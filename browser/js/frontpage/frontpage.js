app.config(function($stateProvider) {
    $stateProvider.state('frontpage', {
        cache: false,
        url: '/',
        templateUrl: 'js/frontpage/frontpage.html',
        controller: 'FrontpageCtrl'
    });
});

app.controller('FrontpageCtrl', function($scope, $state, Socket, SocketService) {

    $scope.randomMatch = function() {
        $scope.searching = true;
        Socket.emit('randomMatch');
    };

    Socket.on('gameStart', function(payload) {
        $('#waiting').closeModal();
        $scope.searching = false;
        $state.go('game', { gameId: payload.room });
    });


    $scope.runLogo = function() {
        $('.element').typed({
            strings: ['TypeRightr'],
            typeSpeed: 50
        });
    }

    $(document).ready(function() {
        $('.trigger-searching').leanModal({
            complete: function() {
                $scope.searching = false;
                Socket.emit('stopMatch');
            }
        });
    });

});
