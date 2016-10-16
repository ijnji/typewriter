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

app.controller('SignupCtrl', function ($scope, $state, $log, AuthService, UserFactory, SocketService) {
    $scope.submitSignup = function(data) {
        console.log('submitting')
        return UserFactory.addPlayer(data)
                .then(function(user) {
                    $scope.loginInfo = {
                        email: user.email,
                        password: data.password
                    };
                    AuthService.login($scope.loginInfo);
                 })
                .then(function(){
                   SocketService.loginOrLogoutHandler();
                   $state.go('frontpage');
                })
                .catch($log.error);
    };
});
