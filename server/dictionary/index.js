var fs = require('fs');

const DICT = fs.readFileSync(__dirname+'/dictionary.txt').toString().split('\n');
module.exports = DICT;
