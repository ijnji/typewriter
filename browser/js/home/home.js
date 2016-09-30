
$(window).keydown(function(event) {
	let fun = String.fromCharCode(event.which)
	
})
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
let words = {a : {current: null, list: []},
b: {current: null, list: []},
c: {current: null, list: []},
d: {current: null, list: []},
e: {current: null, list: []},
f: {current: null, list: []},
g: {current: null, list: []},
h: {current: null, list: []},
i: {current: null, list: []},
j: {current: null, list: []},
k: {current: null, list: []},
l: {current: null, list: []},
m: {current: null, list: []},
n: {current: null, list: []},
o: {current: null, list: []},
p: {current: null, list: []},
q: {current: null, list: []},
r: {current: null, list: []},
s: {current: null, list: []},
t: {current: null, list: []},
u: {current: null, list: []},
v: {current: null, list: []},
w: {current: null, list: []},
x: {current: null, list: []},
y: {current: null, list: []},
z: {current: null, list: []}
}
let domElements = {};
$(function(){
  for(let i = 0; i<alphabet.length; i++){
    domElements[alphabet[i]] = $('#' + alphabet[i]);
  }
  console.log(domElements);
});

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

  Socket.on('alapha', function(newWords) {
    addWords(newWords);
  })


  let addWords = function(newWords) {
    newWords.forEach(word => {
      words[word[0]].list.push(word)
    })
  }
// need max number of words
let currentWords = {}
  
let newCurrent = function() {
  player.word = null
  wordLetter = player.word.text[0];
  words[wordLetter].current = words[wordLetter].list.pop();
  domElement[wordLetter].text = words[wordLetter].current;
}

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
        if(player.word.remain.length < 1) {
            newCurrent();
        }

      console.log(player.word.remain, $scope.words[0].remain);
    }
    // $scope.$digest();
  }

  $scope.fallWord = function(word){
    word.fall = true;
  }
  $scope.subLetter = function(word){
    word.remain = word.remain.substring(1, word.remain.length);
  }
});

