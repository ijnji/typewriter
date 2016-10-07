 /* eslint-disable no-floating-decimal */
 'use strict'
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
    // console.log(charLimit)
    for (let key in charLimit) {
        words[key] = []
        let counter = charLimit[key]

        while (counter > 0) {
            words[key].push(DictObj[key][Math.floor(Math.random() * DictObj[key].length)])
            counter = counter - key

        }

    }

    
    
    return waveDuration(findChar(diff),words,diff)
}

//randomly determines the number of miniwaves and their length in seconds 
const waveDuration = function(totalChar, words,diff) {

    let secLeft = 120
    let miniWaveSec = []
    
    while (secLeft > 0) {
        let num = 0
        if (secLeft < 50) {
            if (secLeft < 10) {
                // console.log("WOOPIE" ,secLeft)
                num = _.random(1,secLeft)
            }
            else {
                num  = _.random(10,secLeft)
            }
        }
        else {
            num =  _.random(10,50)
        }
        secLeft = secLeft - num
        if (num > 1) {
            miniWaveSec.push(num)
        }
        else {
            console.log("work?")
        }
        
    }
    // console.log("miniwaves",miniWaveSec)
    // waveInfo(diff,words,miniWaveSec,totalChar)
    return waveInfo(diff,words,miniWaveSec,totalChar)
}

// text,duration


//after get words then decide over the mini interval when to fire them off
// think mini wave as transtion signal or point 


// each random wordlength select word from object[wordlength] and delete it from object[wordlength]
// prop

const waveInfo = function(level, words, miniWaveTimes,totalChar) {
    console.log("hello" )
    let secAndWords = {}
    const charSec = totalChar/120
    let diff = level + 2
    miniWaveTimes.forEach(duration => {
        console.log(miniWaveTimes,duration)
        let wordArray = []
        let numChar = Math.ceil(charSec * duration)
        // let testChar = numChar
        // console.log(testChar)
        while (numChar > 2) {
            let wordLength = _.random((diff-2),(diff + 2))
            if (wordLength === 1) {
                wordLength = _.random((diff-2),(diff + 2))
            }
        //  console.log("woop there it is", wordLength)
        // console.log("HELLO!",words[wordLength] , duration)
            // console.log("Length", words[wordLength].length)
            // console.log("WordLength", wordLength)
            // if (!words[wordLength]) {
                
            //     // console.log("OVER HERE")
            // }
            if(words[wordLength].length > 0) {
                    // console.log(words[wordLength] , wordLength)
                    wordArray.push(words[wordLength][0])
                    words[wordLength].shift()
                    numChar = numChar - wordLength
            }

            

        }
        // console.log("I love start wars")
    
        secAndWords[duration] = wordArray
         // console.log("Array",wordArray)
         // console.log("Duration",duration)
         // console.log("testChar", testChar)
        // 10 seconds
        // 2,3,4,5,6
        // if duration 1 then I won't return anything 
        // console.log("WORD ARRAY", wordArray)
    })
    // console.log(secAndWords)
    // console.log(totalChar)
    // console.log(secAndWords,"over here")
    // sendWordObjects(secAndWords,level)
    return sendWordObjects(secAndWords,level)
}

const sendWordObjects = function(secAndWords,level) {
    console.log("ALI!!!!",secAndWords)
    let numbers = []
    let Objects = {}
    let rangeNumber = _.random((1,level + 10))/(100)
    let rangeOsc = _.random(1,2)
    if (rangeOsc === 1) {
        rangeNumber = -(rangeNumber)
    }
    for (let x in secAndWords) {
        numbers.push(x)
    }
    
     
     while (numbers.length > 0) {

         let rand =_.random(0,numbers.length -1)
         if (!numbers[rand]) {
             rand =_.random(0,numbers.length - 1)
         }
         
         let numberObjects = []
         
         secAndWords[numbers[rand]].forEach(word => {
            
             let duration =  (numbers[rand]) / (word.length)
              duration = Math.ceil(duration + (duration * rangeNumber))
               
             let wordObj = {text: word, duration: duration}
             numberObjects.push(wordObj)
             // seconds and length will create "correct number" range will alter it by x %
             // does range start and end points flucate? 
             // up to 15% starts at 5%
         })
         Objects[numbers[rand]] = numberObjects
        numbers.splice(rand,1)
        
     }
     

     return Objects

}

    // need random order of keys (from secAndWords object)
    // get array corrisponding to key 
    // detrimine duration of each word based on length, miniwavetime, and range (range is precentage?)
    // send words to client in quick sessesion 
    // send next batch after key (key equals seconds)

    // going to make mini waves every wave will have an x amount of time they should be typed before die the seconds of these waves
    // will add up to 60
    // the wave seconds number will fall into a range determined by the level 
    // the mini wave sec range will go from 5 - 25
    // a level 1 wave has 100 chr a mini wave with the second time of 10 will spit out a combintion of 16.6 (will round up to 17) chars 
    // if word combo not found will round up 

    // need to type 1.66 on average per second needs to average out to this 
    // on average per second will start at 5 
    // previous length effcts next possible duration range 
    // need to have range [-x]
    // range becomes more erractic per level? 
    //have 60 seconds worth of words now need to distrubte over 60 seconds
    //range of durations and frequency based on level and word length 




// just going to round up if char not even with stuff
//once over char send words in the array
// need x amount of char also need to limit length of words? Also need full length
// go up diffuctly if get done before


module.exports = {
    // DICT: DICT,
    // DictObj: DictObj,
    wordOutput: wordOutput
    // randomWord: randomWord
};
