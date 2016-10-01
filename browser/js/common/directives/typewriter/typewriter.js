app.directive('typewriter', function($rootScope, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/typewriter/typewriter.html',
        link: function(scope) {

            // Main game loop.
            // Input modifies the game state. View draws based on game state.

        }

    };

});
