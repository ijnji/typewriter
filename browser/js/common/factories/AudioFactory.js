app.factory('AudioFactory', function () {

    let AudioFactory = {};

    AudioFactory.play = function (name){
        var audio = new Audio(`/audio/${name}.wav`);
        audio.play();
    };

    return AudioFactory;
});
