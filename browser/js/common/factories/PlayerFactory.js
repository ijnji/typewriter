'use strict';

app.factory('PlayerFactory', function(UtilityFactory, WordFactory) {

    let correctWordsTyped = 0;
    let totalWordsTyped = 0;

    const Player = function(socketId) {
        this.difficulty = 0;
        this.id = socketId;
        this.word = '';
        this.activeWords = [];
    }

    Player.prototype.addWord = function(text, duration) {
        this.activeWords.push(new WordFactory.Word(text, duration));
        JSON.stringify(this.activeWords);
    }

    Player.prototype.newChar = function(char) {
        this.word += char;
    }

    Player.prototype.removeChar = function(char) {
        this.word = this.word.substring(0, this.word.length - 1 );
    }

    Player.prototype.validateInput = function(){
        totalWordsTyped++;
        for (var i = 0; i < this.activeWords.length; i++){
            if (this.activeWords[i].text === this.word) {
                correctWordsTyped++;
                this.activeWords.splice(i, 1);
            }
        }
        this.clearWord();
    }
    Player.prototype.clearWord = function(){
        this.word = '';
    }

    Player.prototype.showAccuracy = function () {
        let accuracy = (correctWordsTyped / totalWordsTyped).toFixed(2);
        console.log(accuracy * 100);
    }

    return {
        Player: Player
    }

});
