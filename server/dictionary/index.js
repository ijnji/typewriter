 /* eslint-disable no-floating-decimal */
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const dictionaryPath = path.join(__dirname, '/dictionary.txt');
const DICT = fs.readFileSync(dictionaryPath).toString().toLowerCase()
            .split('\n');
const DictObj = _.groupBy(DICT, value => value.length)
const BaseCharLength = 50;


const findChar = function(diff) {
    return BaseCharLength + (BaseCharLength * diff)
}

const randomWord = function() {
    return DICT[Math.floor(Math.random() * (DICT.length - 1))]
}

const getCharLimit = function(diff) {

    const charLimit = {}
    const diffLength = 2 + diff

    const rangeOfOffsets = _.range(-2, 3);
    const percentages = [.03, .14, .66, .14, .03];
    const offsetsWithPercentages = _.zip(rangeOfOffsets, percentages);

    offsetsWithPercentages.forEach(([offset, percentage]) => {
        charLimit[diffLength + offset] = findChar(diff + offset) * percentage;
    });

    return charLimit
}
// wordOutPut called twice every 60 seconds 
const wordOutput = function(diff) {
    let words = {}

    const charLimit = getCharLimit(diff)
    console.log(charLimit)
    for (let key in charLimit) {
        words[key] = []
        let counter = charLimit[key]

        while (counter > 0) {
            words[key].push(DictObj[key][Math.floor(Math.random() * DictObj[key].length)])
            counter = counter - key

        }

        // duration(findChar(diff),words)
    }
    console.log("object",words)
    return words
}

// one big function that has interval 
// sendWords is called every 60 seconds 
const duration = function(totalChar, words) {

    const charSec = totalChar/60

    // need to type 1.66 on average per second 
    // need to have range [2-x]
    // range becomes more erractic per level? 
    //have 60 seconds worth of words now need to distrubte over 60 seconds
    //range of durations and frequency based on level and word length 

}


// just going to round up if char not even with stuff
//once over char send words in the array
// need x amount of char also need to limit length of words? Also need full length
// go up diffuctly if get done before


module.exports = {
    DICT: DICT,
    DictObj: DictObj,
    wordOutput: wordOutput,
    randomWord: randomWord
};
