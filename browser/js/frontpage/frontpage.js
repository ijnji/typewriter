app.config(function($stateProvider) {
    $stateProvider.state('frontpage', {
        cache: false,
        url: '/',
        templateUrl: 'js/frontpage/frontpage.html',
        controller: 'FrontpageCtrl'
    });
});

app.controller('FrontpageCtrl', function($scope, $state, Socket, AudioFactory, SocketService) {


    $scope.testMatch = function() {
        $state.go('test');
    };

    // document.onkeydown = function () {
    //     AudioFactory.play('singletype');
    // };

    $scope.randomMatch = function() {
        $scope.searching = true;

        console.log('request randomMatch');
        Socket.emit('randomMatch');
    };

    Socket.on('gameStart', function(payload) {
        $('#waiting').closeModal();
        $scope.searching = false;
        $state.go('game', { gameId: payload.room });
    });


    $scope.runLogo = function(){
        $(".element").typed({
            strings: ["TypeRightr"],
            typeSpeed: 50
        });
    }

    $(document).ready(function(){
            $('.trigger-searching').leanModal({
            complete: function () {
                $scope.searching = false;
                Socket.emit('stopMatch');
            }
        });
  });

});


