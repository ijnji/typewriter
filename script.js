let fs = require('fs');
fs.readFile('./cmudict.txt', function(err, data) {
    if (err) throw err;
    let line = data.toString();
    line = line.split('\n');
    line = line.forEach(function(l) {
        return l.split(' ')[0];
    });
    console.log(line);
});
