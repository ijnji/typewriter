'use strict';

app.factory('DrawStreakFactory', function() {

    let factory = {};

    factory.playerMeDrawing = undefined;
    factory.playerRivalDrawing = undefined;

    factory.playerMeStreakSprite = undefined;
    factory.playerRivalStreakSprite = undefined;

    factory.playerMeStreak = 0;
    factory.playerRivalStreak = 0;

    factory.initialize = function() {
        factory.playerMeDrawing = $('#playerMeDrawing');
        factory.playerRivalDrawing = $('#playerRivalDrawing');
    };

    factory.reset = function() {
        factory.playerMeDrawing.remove();
        factory.playerRivalDrawing.remove();
    };

    factory.clearMe = function() {
        factory.playerMeStreakSprite.remove();
        factory.playerMeStreak = 0;
    };

    factory.clearRival = function() {
        factory.playerRivalStreakSprite.remove();
        factory.playerRivalStreak = 0;
    };

    factory.incrementMe = function() {
        // factory.playerMeStreakSprite.remove();
        factory.playerMeStreakSprite = new StreakSprite(factory.playerMeDrawing, ++factory.playerMeStreak);
    };

    factory.incrementRival = function() {
        // factory.playerRivalStreakSprite.remove();
        factory.playerRivalStreakSprite = new StreakSprite(factory.playerRivalDrawing, ++factory.playerRivalStreak);
    };

    return factory;

});

function StreakSprite(drawing, count) {
    this.posDiv = $('<div class="gameContainerStreakSprite"></div>');
    drawing.append(this.posDiv);
    this.posDiv.css('top', '50%');
    this.posDiv.css('left', '50%');
    this.posDiv.css('transform', 'translate(-50%, -50%)');
    this.numDiv = $('<div class="gameContainerStreakSpriteNum">' + count + '</div>');
    this.posDiv.append(this.numDiv);
    this.txtDiv = $('<div class="gameContainerStreakSpriteTxt">Streak</div>');
    this.posDiv.append(this.txtDiv);
    // this.numDiv.addClass('animated bounce');
}