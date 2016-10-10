const dictionaryUtils = require('../dictionary');
const _ = require('lodash');

function getRandomWordByLength(length){
    const sameLengthWordArray = dictionaryUtils.dictObj[length];
    return sameLengthWordArray[ _.random(0, sameLengthWordArray.length -1 ) ];
}


function wordEmitterMaker (minChar, maxChar, minDur, maxDur) {
    return function(room, io) {
        console.log('emitting a word');
        const word = getRandomWordByLength(_.random(minChar,maxChar));
        const duration = _.random(minDur,maxDur);
        io.to(room).emit('newWord', {text: word, duration: duration, xoffset: Math.random() });
    }
}



const levels = [
    {fn: wordEmitterMaker(3, 5, 10, 15), freqRange: [1000, 2000]},//level 1...
    {fn: wordEmitterMaker(3, 6, 9, 15), freqRange: [450, 1900]},
    {fn: wordEmitterMaker(4, 6, 8, 15), freqRange: [440, 2000]},
    {fn: wordEmitterMaker(4, 7, 7, 15), freqRange: [430, 1900]},
    {fn: wordEmitterMaker(5, 7, 6, 15), freqRange: [420, 2000]},
    {fn: wordEmitterMaker(6, 8, 5, 15), freqRange: [410, 1900]},
    {fn: wordEmitterMaker(7, 8, 10, 15), freqRange: [400, 2000]},
    {fn: wordEmitterMaker(8, 8, 10, 15), freqRange: [390, 1900]}, //level 8...
];

const levelDurationMiliseconds = 1000;
function emitWords(room, io) {
    let totalWait = 0;
    for (let i = 0; i < levels.length; i++) {
        let levelWait = 0;
        console.log(levels[i]);
        while (levelWait < 5000) {
            let randomTime = _.random(levels[i].freqRange[0], levels[i].freqRange[1]);
            levelWait += randomTime;
            totalWait += randomTime;
            setTimeout(function(){
                levels[i].fn(room, io);
            }, totalWait);
        }
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
module.exports = {emitWords: emitWords}
