app.config(function($stateProvider) {
    $stateProvider.state('user', {
        url: '/users/:id',
        templateUrl: 'js/user/user.html',
        controller: 'UserCtrl',
        resolve: {
            user: function(UserFactory, $stateParams){
                return UserFactory.getById($stateParams.id);
            },
            matches: function(MatchFactory, $stateParams){
                // return 'matches';
                return MatchFactory.getAllForUser($stateParams.id);
            }
        }
    });
});

app.controller('UserCtrl', function($scope, UserFactory, user, matches){
    $scope.user = user;
    $scope.matches = matches;

    let findAccuracy = function (){
        let accuracy = $scope.user.averageAccuracy * 100;
        if (isNaN(accuracy)) {
            accuracy = 0;
        }
        console.log(accuracy);
        return accuracy;
    }
    $scope.user.averageAccuracy = findAccuracy();
});
