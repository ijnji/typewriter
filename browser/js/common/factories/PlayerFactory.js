'use strict';

app.factory('PlayerFactory', function(UtilityFactory, WordFactory) {

    let Player = function(socketId) {
        this.difficulty = 0;
        this.id = '/#' + socketId;
        this.letter = null;
        this.typed = null;
        this.remaining = null;
        this.activeWords = {};
        UtilityFactory.ALPHABET.forEach(letter => {
            this.activeWords[letter] = null;
        });
    }

    Player.prototype.addWord = function(text, duration) {
        this.activeWords[text[0]] = new WordFactory.Word(text, duration);
    }

    Player.prototype.newChar = function(char) {
        if (!this.letter) {
            if (!this.activeWords[char]) return;
            this.typed = char;
            this.remaining = this.activeWords[char].text.substring(1);
            this.letter = this.remaining[0];
        } else if (this.letter === char) {
            this.typed += char;
            this.remaining = this.remaining.substring(1);
            this.letter = this.remaining[0];
        }
        if (this.remaining === '') {
            this.activeWords[this.typed[0]] = null;
            this.typed = null;
            this.remaining = null;
        }
    }

    return {
        Player: Player
    }

});
