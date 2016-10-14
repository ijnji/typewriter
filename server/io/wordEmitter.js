const dictionaryUtils = require('../dictionary');
const _ = require('lodash');

function getRandomWordByLength(length) {
    const sameLengthWordArray = dictionaryUtils.dictObj[length];
    return sameLengthWordArray[_.random(0, sameLengthWordArray.length - 1)];
}


function wordEmitterMaker(minChar, maxChar, minDur, maxDur) {
    return function(room, io) {
        const word = getRandomWordByLength(_.random(minChar, maxChar));
        const duration = _.random(minDur, maxDur);
        io.to(room).emit('newWord', { text: word, duration: duration, xoffset: Math.random() });
    }
}

const levels = [

    { fn: wordEmitterMaker(3, 5, 12, 15), freqRange: [1900, 2000] }, //level 1...
    { fn: wordEmitterMaker(3, 6, 11, 14), freqRange: [1000, 1200] },
    { fn: wordEmitterMaker(4, 6, 10, 14), freqRange: [1400, 1900] },
    { fn: wordEmitterMaker(4, 7, 9, 13), freqRange: [1500, 1800] },
    { fn: wordEmitterMaker(5, 7, 8, 13), freqRange: [1400, 1800] },
    { fn: wordEmitterMaker(6, 8, 7, 13), freqRange: [1350, 1600] },
    { fn: wordEmitterMaker(7, 8, 7, 13), freqRange: [1350, 1500] },
    { fn: wordEmitterMaker(6, 8, 7, 13), freqRange: [1300, 1400] },
    { fn: wordEmitterMaker(6, 8, 7, 13), freqRange: [1300, 1400] },
    { fn: wordEmitterMaker(6, 8, 7, 13), freqRange: [1100, 1400] },
    { fn: wordEmitterMaker(6, 8, 7, 13), freqRange: [1000, 1000] },
    { fn: wordEmitterMaker(6, 8, 7, 13), freqRange: [1000, 1000] },
    { fn: wordEmitterMaker(6, 8, 7, 13), freqRange: [1000, 1000] },
    { fn: wordEmitterMaker(3, 5, 6, 13), freqRange: [400, 500] },
    { fn: wordEmitterMaker(6, 8, 7, 13), freqRange: [1000, 1000] },
    { fn: wordEmitterMaker(3, 5, 6, 13), freqRange: [400, 500] },
    { fn: wordEmitterMaker(6, 8, 7, 13), freqRange: [1000, 1000] },
    { fn: wordEmitterMaker(3, 5, 6, 13), freqRange: [400, 500] },
    { fn: wordEmitterMaker(6, 8, 7, 13), freqRange: [1000, 1000] },
    { fn: wordEmitterMaker(3, 5, 6, 13), freqRange: [400, 500] } //level x...
];

const pressurelevels = [
    { fn: wordEmitterMaker(10, 10, 12, 15) }
];

let roomToTimeouts = {};

function emitWords(room, io) {
    roomToTimeouts[room] = [];
    let totalWait = 0;
    for (let i = 0; i < levels.length; i++) {
        let levelWait = 0;
        while (levelWait < 7000) {
            let randomTime = _.random(levels[i].freqRange[0], levels[i].freqRange[1]);
            levelWait += randomTime;
            totalWait += randomTime;
            let timeout = setTimeout(function() {
                levels[i].fn(room, io);
            }, totalWait);
            roomToTimeouts[room].push(timeout);
        }
    }
}

function stopWords(room) {
    const roomTimeouts = roomToTimeouts[room];
    for (let i = 0; i < roomTimeouts.length; i++) {
        clearTimeout(roomTimeouts[i]);
    }
}

module.exports = { emitWords: emitWords, stopWords: stopWords }
