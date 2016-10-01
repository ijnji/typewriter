app.factory('WordFactory', function(){
  let Word = function(text, duration){
    this.text = text;
    this.end = Date.now() + duration*1000;
  }
  return {
    Word: Word
  }
})
