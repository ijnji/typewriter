'use strict';

app.factory('PlayerFactory', function(UtilityFactory, WordFactory) {


    const Player = function(socketId) {
        this.id = socketId;
        this.streak = 0;
        this.word = '';
        this.activeWords = [];
        this.totalWordsTyped = 0;
        this.correctWordsTyped = 0;
        this.longestStreak = 0;
    }

    Player.prototype.addWord = function(text, duration) {
        this.activeWords.push(new WordFactory.Word(text, duration));
        JSON.stringify(this.activeWords);
    }

    Player.prototype.incrementStreak = function(){
        this.streak++;
        this.longestStreak = this.streak > this.longestStreak ? this.streak : this.longestStreak;
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
        this.totalWordsTyped++;
        let hit = false;
        for (var i = 0; i < this.activeWords.length; i++){
            if (this.activeWords[i].text === this.word) {
                this.correctWordsTyped++;
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
        let accuracy = (this.correctWordsTyped / this.totalWordsTyped).toFixed(2) * 100;
        if (isNaN(accuracy)) {
            accuracy = 0;
        }
        return accuracy;
    }

    Player.prototype.wordsPerMinute = function (time) {
        let wpm = Math.round((60000 * this.correctWordsTyped) / time);
        return wpm;
    }

    return {
        Player: Player
    }

});
