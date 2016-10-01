'use strict';

app.factory('PlayerFactory', function() {
    return function() {
      this.letter = undefined;
      this.currLeft = undefined;

    };
});
