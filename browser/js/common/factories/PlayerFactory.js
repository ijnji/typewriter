'use strict';

app.factory('PlayerFactory', function(UtilityFactory, WordFactory) {

    const Player = function(socketId) {
        this.difficulty = 0;
        this.id = socketId;
        this.word = '';
        this.activeWords = [];
        UtilityFactory.ALPHABET.forEach(letter => {
            this.activeWords[letter] = null;
        });
    }

    Player.prototype.addWord = function(text, duration) {
        //this.activeWords[text[0]] = new WordFactory.Word(text, duration);
        this.activeWords.push(new WordFactory.Word(text, duration));
    }

    Player.prototype.newChar = function(char) {
        this.word += char;
    }

    Player.prototype.removeChar = function(char) {
        this.word = this.word.substring(0, this.word.length - 1 );
    }

    Player.prototype.validateInput = function(){
        console.log('active words', this.activeWords);
        for (var i = 0; i < this.activeWords.length; i++){
            if (this.activeWords[i].text === this.word) {
                console.log('word found', this.word);
                 this.activeWords[this.word[0]] = null;
            } else {
                console.log('word not found', this.word)
            }
        }
        // let targetWord = this.activeWords[this.word[0]];
        // if (targetWord && targetWord === this.word) {
        //     this.activeWords[this.word[0]] = null;
        // }
        this.clearWord();
    }
    Player.prototype.clearWord = function(){
        this.word = '';
    }

    return {
        Player: Player
    }

});
