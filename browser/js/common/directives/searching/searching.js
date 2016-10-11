app.directive('searching', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/searching/searching.html',
        scope: true,
        link: function (scope, el, attr){
            console.log(scope.searching);
            const dots = $("#waiting").text();
            let i  = 0, setDots;
             // if (scope.searching) {
                console.log(scope.searching);
                setInterval(function() {

                $("#waiting").append(".");
                i++;

                if(i === 4)
                {
                    var text =$("#waiting").html(dots);
                    i = 0;
                }

            }, 500);
        // }
        //     else {
        //         clearInterval(setDots);
        //     }
        }
    }
})
