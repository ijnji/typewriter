
$(window).keydown(function(event) {
	let fun = String.fromCharCode(event.which)
	
})

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});


app.controller('HomeCtrl', function ($scope, Socket, PlayerFactory) {
  let elem = document.getElementById('stego');
  let p1 = new PlayerFactory.Player();
  Socket.on('connect', function () {
    console.log('i am connected!');
  });
  Socket.on('helloworld', function () {
    console.log('hello world');
  });
  $scope.words = [{
    text: 'stegosauras',
    remain: 'stegosauras',
    fall: true
  }];
  $scope.classes = {
    'ran-ani': false
  };

  $(window).keydown(event => {
    var char = String.fromCharCode(event.which);
    handleKey(char, p1);
  });
  let handleKey = function(char, player){
    char = char.toLowerCase();
    //SHOULD: check if word is falling, not just if it is in the array.
    if (!player.word) {
      for (let i = 0; i < $scope.words.length; i++) {
        let word = $scope.words[i];
        if (word.text[0] === char) {
          player.word = word;
          word.remain = word.remain.substr(1,word.length);
          console.log(player.word.remain);
          elem.text = word.remain;
        }
      }
    }
    else if (player.word.remain[0] === char) {
      player.word.remain = player.word.remain.substr(1,player.word.remain.length);
      console.log(player.word.remain, $scope.words[0].remain);
    }
    $scope.$digest();
  }

  $scope.fallWord = function(word){
    word.fall = true;
  }
  $scope.subLetter = function(word){
    word.remain = word.remain.substring(1, word.remain.length);
  }
});

