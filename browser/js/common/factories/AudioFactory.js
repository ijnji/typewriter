app.factory('AudioFactory', function($state) {

    let AudioFactory = {};

    AudioFactory.playFile = function(name) {
        if ($state.current.name === 'game') {
            let audio = new Audio(`/audio/${name}.wav`);
            audio.play();
        }
    };

    return AudioFactory;
});
