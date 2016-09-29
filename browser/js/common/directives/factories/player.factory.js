app.factory('PlayerFactory', function(){
  var Player = function(){
    this.word = null;
    this.score = 0;
  };
  Player.prototype.getWord = function(){
    return this.word;
  }
  Player.prototype.setWord = function(word){
    this.word = word;
  }
  return{
    Player: Player
  }
})
