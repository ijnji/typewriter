describe ('PlayerFactory', function () {

  var Player1, Player2;

  //load our Angular application from scratch
  beforeEach(module('TypeWriterApp'));

  var $httpBackend, PlayerFactory;

 //TLEE note: clarify how this works with kate
  beforeEach('Get tools', inject(function (_$httpBackend_, _PlayerFactory_) {
    $httpBackend = _$httpBackend_;
    PlayerFactory = _PlayerFactory_;
  }));

  beforeEach(function () {
    Player1 = new PlayerFactory.Player('123');
    Player2 = new PlayerFactory.Player('456');
    Player1.addWord('hello', 10);
    Player1.addWord('zoo', 4);
    Player1.addWord('elephant', 7);

  })

  afterEach(function(){
    try {
      //verifies all the requests via expect were made
      $httpBackend.verifyNoOutstandingExpectation(false);
      //checks that $httpbackend andled all expected calls
      $httpBackend.verifyNoOutstandingRequest();
    } catch (err) {
      this.test.error(err);
    }
  });
  it("is an object", function () {
    expect(PlayerFactory).to.be.an('object');
  });

  describe("addWord", function (){
    it("is a function", function() {
     expect(Player1.addWord).to.be.a('function');
    });
    it("adds word to player activeWords")

});

// addWord test if activeWords changes and is stringified
// test incrementStreak 
// test newChar
//test removeChar
// test validateInput (look in to that more)
// test clearWord
// test showAccuracy
// test wordsPerMinute