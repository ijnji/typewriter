app.config(function($stateProvider) {
    $stateProvider.state('users', {
        url: '/users',
        templateUrl: 'js/user/users.html',
        controller: 'UsersCtrl',
        resolve: {
            users: function(UserFactory) {
                return UserFactory.getAll();
            }
        }
    });
});

app.controller('UsersCtrl', function($scope, users) {
    $scope.users = users;
});
