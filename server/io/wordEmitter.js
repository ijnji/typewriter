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
    {fn: wordEmitterMaker(3, 5, 10, 15), freqRange: [1000, 2000]}, //level 1...
    {fn: wordEmitterMaker(3, 6, 10, 15), freqRange: [450, 1900]},
    {fn: wordEmitterMaker(4, 6, 10, 15), freqRange: [440, 2000]},
    {fn: wordEmitterMaker(4, 6, 10, 15), freqRange: [430, 1900]},
    {fn: wordEmitterMaker(2, 5, 10, 15), freqRange: [420, 2000]},
    {fn: wordEmitterMaker(2, 5, 10, 15), freqRange: [410, 1900]},
    {fn: wordEmitterMaker(2, 5, 10, 15), freqRange: [400, 2000]},
    {fn: wordEmitterMaker(2, 5, 10, 15), freqRange: [390, 1900]}, //level 8...
];

const levelDurationMiliseconds = 1000;
function emitWords(room, io) {
let counter =0;
    let totalWait = 0
    while(totalWait < 15000){
        counter ++;
        console.log("new loop");
        totalWait += _.random(levels[0].freqRange[0], levels[0].freqRange[1]);
        setTimeout(function(){
            levels[0].fn(room, io);
        }, totalWait);
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
}


// _.random(level.freqRange[0], level.freqRange[1]);
module.exports = {emitWords: emitWords}
