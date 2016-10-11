app.config(function($stateProvider) {
    $stateProvider.state('frontpage', {
        cache: false,
        url: '/',
        templateUrl: 'js/frontpage/frontpage.html',
        controller: 'FrontpageCtrl'
    });
});

app.controller('FrontpageCtrl', function($scope, $state, Socket, AudioFactory) {

    $scope.testMatch = function() {
        $state.go('test');
    };

    // document.onkeydown = function () {
    //     AudioFactory.play('singletype');
    // };

    $scope.randomMatch = function() {
        console.log('request randomMatch');
        $scope.searching = true;
        Socket.emit('randomMatch');
    };

    Socket.on('gameStart', function(payload) {
        $state.go('game', { gameId: payload.room });
    });


    $scope.runLogo = function(){
        $(".element").typed({
            strings: ["TypeRightr"],
            typeSpeed: 50
        });
    }

});


