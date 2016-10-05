'use strict';

app.factory('PlayerFactory', function(UtilityFactory, WordFactory) {

    const Player = function(socketId) {
        this.difficulty = 0;
        this.id = socketId;
        this.word = '';
        this.activeWords = {};
        UtilityFactory.ALPHABET.forEach(letter => {
            this.activeWords[letter] = null;
        });
    }

    Player.prototype.addWord = function(text, duration) {
        this.activeWords[text[0]] = new WordFactory.Word(text, duration);
    }

    Player.prototype.newChar = function(char) {
        this.word += char;
    }

    Player.prototype.removeChar = function(char) {
        this.word = this.word.substring(0, this.word.length - 1 );
    }

    Player.prototype.validateInput = function(){
        let targetWord = this.activeWords[this.word[0]];
        if (targetWord && targetWord === this.word) {
            targetWord = null;
        }
        this.clearWord();
    }
    Player.prototype.clearWord = function(){
        this.word = '';
    }

    return {
        Player: Player
    }

});
