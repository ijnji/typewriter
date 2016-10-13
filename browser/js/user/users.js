app.config(function($stateProvider) {
    $stateProvider.state('users', {
        url: '/users/',
        templateUrl: 'js/user/users.html',
        controller: 'UsersCtrl',
        resolve: {
            users: function(UserFactory){
                return UserFactory.getAll();
            }
        }
    });
});

app.controller('UserCtrl', function($scope){
    $scope.users = users;
});
