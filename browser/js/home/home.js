app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});


app.controller('HomeCtrl', function ($scope, Socket) {
  Socket.on('connect', function () {
    console.log('i am connected!');
  })
  Socket.on('helloworld', function () {
    console.log('hello world');
  })
});
