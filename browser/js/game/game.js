
app.config(function($stateProvider) {
    $stateProvider.state('game', {
        url: '/game/:gameId',
        templateUrl: 'js/game/game.html',
        controller: 'GameCtrl'
    });
});


app.controller('GameCtrl', function($scope, Socket, $state, Utils, PlayerFactory) {

    // $scope.playerMe = new PlayerFactory.Player();
    // $scope.playerRival = new PlayerFactory.Player();
    //
    // angular.element(document).ready(function() {
    //
    //     $(window).keypress(function(e) {
    //         Socket.emit('eveClnKey', {
    //             key: e.key
    //         });
    //     });

        // TODO: socket on

        // $scope.playerMe.elem = document.getElementById('elemPlayerMe');
        // Utils.ALPHABET.forEach(function(l, idx) {
        //     let elm = document.createElement('div');
        //     $scope.playerMe.divs[l] = elm;
        //     $scope.playerMe.elem.appendChild(elm);
        //     $scope.playerMe.wordPool[l] = TESTWORDS[idx];
        //     elm.innerHTML = TESTWORDS[idx];
        //     elm.setAttribute('class', 'gameWordDiv animateFall');
        //     elm.style.left = randNum(80) + '%';
        //     elm.style.animationDuration = (randNum(15) + 30) + 's';
        // });
});


    // if ($state.params.gameId) {
    //     Socket.emit('eventClientJoinGame', {
    //         gameId: $state.params.gameId
    //     });
    // }

    // let letters = ['a', 'b', 'c', 'd'];
    // let TESTWORDS = [
    //     'apple',
    //     'banana',
    //     'choir',
    //     'determinism'
    // ];
    // $scope.playerOne = {
    //     'currLetter': undefined,
    //     'currLeft': undefined,
    //     'currRight': undefined,
    //     'drawElm': undefined,
    //     'divElms': {},
    //     'wordPool': {}
    // };
    // angular.element(document).ready(function() {

    //     window.s = $scope;
    //     $(window).keypress(keyHandler);

    //     $scope.playerOne.drawElm = document.getElementById('gamePlayerOne');
    //     letters.forEach(function(l, idx) {
    //         let elm = document.createElement('div');
    //         $scope.playerOne.divElms[l] = elm;
    //         $scope.playerOne.drawElm.appendChild(elm);
    //         $scope.playerOne.wordPool[l] = TESTWORDS[idx];
    //         elm.innerHTML = TESTWORDS[idx];
    //         elm.setAttribute('class', 'gameWordDiv animateFall');
    //         elm.style.left = randNum(80) + '%';
    //         elm.style.animationDuration = (randNum(15) + 30) + 's';
    //     });
    // });

    // let randNum = function(max) {
    //     return Math.floor(Math.random() * max);
    // };

    // let keyHandler = function(e) {
    //     let c = e.key;
    //     if (!$scope.playerOne.currLetter) {
    //        if (!$scope.playerOne.wordPool[c]) return;
    //        let word = $scope.playerOne.wordPool[c];
    //        $scope.playerOne.currLetter = c;
    //        $scope.playerOne.currLeft = word.substring(0, 1);
    //        $scope.playerOne.currRight = word.substring(1);
    //        $scope.playerOne.divElms[c].innerHTML = calcDivHtml(
    //             $scope.playerOne.currLeft,
    //             $scope.playerOne.currRight
    //        );
    //     } else {
    //         if (c !== $scope.playerOne.currRight[0]) return;
    //         $scope.playerOne.currLeft += $scope.playerOne.currRight[0];
    //         $scope.playerOne.currRight = $scope.playerOne.currRight.substring(1);
    //         $scope.playerOne.divElms[$scope.playerOne.currLetter].innerHTML = calcDivHtml(
    //             $scope.playerOne.currLeft,
    //             $scope.playerOne.currRight
    //         );
    //         if ($scope.playerOne.currRight === '') {
    //             $scope.playerOne.wordPool[$scope.playerOne.currLetter] = undefined;
    //             $scope.playerOne.currLetter = undefined;
    //             $scope.playerOne.currLeft = undefined;
    //             $scope.playerOne.currRight = undefined;
    //         }
    //     }
    // };

    // let calcDivHtml = function(left, right) {
    //     return '<span class="gameCurrLeft">'
    //         + left + '</span>' + right;
    // };
