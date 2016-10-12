'use strict';

app.factory('PlayerFactory', function(UtilityFactory, WordFactory) {

    let correctWordsTyped = 0;
    let totalWordsTyped = 0;

    const Player = function(socketId) {
        this.id = socketId;
        this.streak = 0;
        this.word = '';
        this.activeWords = [];
    }

    Player.prototype.addWord = function(text, duration) {
        this.activeWords.push(new WordFactory.Word(text, duration));
        JSON.stringify(this.activeWords);
    }

    Player.prototype.incrementStreak = function(){
        this.streak++;
    }

    Player.prototype.resetStreak = function(){
        this.streak = 0;
    }

    Player.prototype.newChar = function(char) {
        this.word += char;
    }

    Player.prototype.removeChar = function(char) {
        this.word = this.word.substring(0, this.word.length - 1 );
    }

    Player.prototype.validateInput = function(callback){
        let idx = -1;
        totalWordsTyped++;
        let hit = false;
        for (var i = 0; i < this.activeWords.length; i++){
            if (this.activeWords[i].text === this.word) {
                correctWordsTyped++;
                idx = i;
                break;
            }
        }
        if (idx > -1) {
            hit = true;
            this.activeWords.splice(idx, 1);
            console.log('calling drawfactory callback');
            callback(this.word);
        }
        this.clearWord();
        return hit;
    }
    Player.prototype.clearWord = function(){
        this.word = '';
    }

    //as a percentage
    Player.prototype.showAccuracy = function () {
        let accuracy = (correctWordsTyped / totalWordsTyped).toFixed(2);
        return accuracy;
    }

    Player.prototype.wordsPerMinute = function (time) {
        let wpm = Math.round((60000 * correctWordsTyped) / time);
        console.log(wpm);
    }

    return {
        Player: Player
    }

});
