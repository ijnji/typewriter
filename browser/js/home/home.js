
$(window).keydown(function(event) {
	let fun = String.fromCharCode(event.which)
	
})

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html'
    });
});

// app.controller('homeMecrtl', function($scope, $interval) {
// 	$scope.position = "asf"
// 	let number = 10
// 	let init = $interval(function() {
// 		number+=1
// 		$scope.position = "-" + number + "px"
		
// 	}, 500)

	
// });


