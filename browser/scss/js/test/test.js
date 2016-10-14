
app.config(function($stateProvider) {
    $stateProvider.state('test', {
        url: '/test',
        templateUrl: 'js/test/test.html',
        controller: 'TestCtrl'
    });
});


app.controller('TestCtrl', function($scope, $state, UtilityFactory, PlayerFactory, Socket) {
    Socket.emit('testMatch');
});
