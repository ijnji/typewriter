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

    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages = function() {
        return Math.ceil(users.length / $scope.pageSize);
    }
    $scope.search = '';
});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

