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
});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

// function MyCtrl($scope) {
//     $scope.currentPage = 0;
//     $scope.pageSize = 10;
//     $scope.data = [];
//     $scope.numberOfPages=function(){
//         return Math.ceil($scope.data.length/$scope.pageSize);
//     }
//     for (var i=0; i<45; i++) {
//         $scope.data.push("Item "+i);
//     }
// }
