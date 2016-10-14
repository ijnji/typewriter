app.directive('myStats', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/gamestats/mystats.html'
    }
})

app.directive('rivalStats', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/gamestats/rivalstats.html'
    }
})
