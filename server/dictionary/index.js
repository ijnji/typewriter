var fs = require('fs');

const DICT = fs.readFileSync(__dirname+'/dictionary.txt').toString().toLowerCase().split('\n');
const randomWord = function(){
  return DICT[Math.floor(Math.random() * DICT.length)];
}
module.exports = {
  DICT: DICT,
  randomWord: randomWord
};
