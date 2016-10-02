app.config(function ($stateProvider) {
    $stateProvider.state('frontpage', {
        url: '/',
        templateUrl: 'js/frontpage/frontpage.html',
        controller: 'FrontpageController'
    });
});

app.controller('FrontpageController', function(Socket, $scope, $state){
  $scope.findGame = function(){
    $scope.searchingForGame = true;
    setTimeout(function(){
      $state.go('game')
    }, 3000);
  }
})
