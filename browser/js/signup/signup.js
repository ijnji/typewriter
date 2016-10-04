app.config(function ($stateProvider) {
  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: 'js/signup/signup.html',
    controller: 'SignupCtrl'
  });
});

app.directive('compareTo', function (){
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      otherValue: '=compareTo'
    },
    link: function (scope, element, attr, ngModel) {
      ngModel.$validators.compareTo = function(value){
        return value === scope.otherValue;
      }
       scope.$watch('otherValue', function () {
        ngModel.$validate();
       });
    }
  }
});

app.controller('SignupCtrl', function ($scope, $state, $log, $http, AuthService, UserFactory, Socket) {
  console.log('here');
    $scope.submitSignup = function(data) {
        return UserFactory.addPlayer(data)
                .then(function(user) {
                    $scope.loginInfo = {
                        email: user.email,
                        password: data.password
                    };
                    console.log('here');
                    AuthService.login($scope.loginInfo);
                  })
                .then(function(){
                  Socket.emit('clnEveUserLobby');
                  console.log('emitted');
                })
                .then(function() {
                  $state.go('home');
                })
                .catch($log.error);
    };
});