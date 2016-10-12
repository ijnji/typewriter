const dictionaryUtils = require('../dictionary');
const _ = require('lodash');

function getRandomWordByLength(length){
    const sameLengthWordArray = dictionaryUtils.dictObj[length];
    return sameLengthWordArray[ _.random(0, sameLengthWordArray.length - 1 ) ];
}


function wordEmitterMaker (minChar, maxChar, minDur, maxDur) {
    return function(room, io) {
        console.log('emitting a word');
        const word = getRandomWordByLength(_.random(minChar, maxChar));
        const duration = _.random(minDur, maxDur);
        io.to(room).emit('newWord', {text: word, duration: duration, xoffset: Math.random() });
    }
}

const levels = [
    {fn: wordEmitterMaker(3, 5, 12, 15), freqRange: [1900, 2000]}, //level 1...
    {fn: wordEmitterMaker(3, 6, 11, 14), freqRange: [1000, 1200]},
    {fn: wordEmitterMaker(4, 6, 10, 14), freqRange: [1400, 1900]},
    {fn: wordEmitterMaker(4, 7, 9, 13), freqRange: [1500, 1800]},
    {fn: wordEmitterMaker(5, 7, 8, 15), freqRange: [500, 500]},
    {fn: wordEmitterMaker(6, 8, 7, 15), freqRange: [1350, 1600]},
    {fn: wordEmitterMaker(7, 8, 7, 15), freqRange: [1350, 1500]},
    {fn: wordEmitterMaker(8, 8, 7, 15), freqRange: [1300, 1400]}, //level 8...
];

let timeOuts = []
const levelDurationMiliseconds = 1000;
function emitWords(room, io) {
    let totalWait = 0;
    let endLevel = false
    for (let i = 0; i < levels.length; i++) {
        let levelWait = 0;
        console.log(levels[i]);
        while (levelWait < 7000) {
            let randomTime = _.random(levels[i].freqRange[0], levels[i].freqRange[1]);
            levelWait += randomTime;
            totalWait += randomTime;
            let timer = setTimeout(function(){
                levels[i].fn(room, io);
            }, totalWait);
            timeOuts.push(timer)
        }
    }
}

function stopWords() {
    for (let i = 0; i < timeOuts.length; i++) {
        clearTimeout(timeOuts[i])
    }
}

// console.log('In emitWords', room, io);
// levels.forEach(level => {
//     console.log('level', level);
//     const levelStart = Date.now();
//     console.log(levelStart + levelDurationMiliseconds, Date.now());
//     while (levelStart + levelDurationMiliseconds >= Date.now()) {
//         // console.log('In while');
//         setTimeout(function(){
//             level.fn(room, io);
//         }, 1000);
//     }
// });


// _.random(level.freqRange[0], level.freqRange[1]);
module.exports = {emitWords: emitWords, stopWords: stopWords}
