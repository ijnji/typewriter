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

    it("adds a value of given text with the key as the first character of the text", function () {
      expect(Player1.activeWords.h.text).to.equal('hello');
      expect(Player1.activeWords.z.text).to.equal('zoo');
      expect(Player1.activeWords.e.text).to.equal('elephant');
    });

    //TLEE: set a range for the time for tesing???
    it("includes an end value to the proper key set to the number of seconds after the word was added", function () {
        expect(Player1.activeWords.h.end).to.equal(Date.now() + 10000);
        expect(Player1.activeWords.z.end).to.equal(Date.now() + 4000);
        expect(Player1.activeWords.e.end).to.equal(Date.now() + 7000);

    });
  });

  describe("newChar", function () {
    it("is a function", function() {
      expect(Player1.newChar).to.be.a('function');
    });

    it("player's letter, typed, and remaining properties will be null if nothing has been typed", function (){
      expect(Player1.typed).to.equal(null);
      expect(Player2.typed).to.equal(null);
      expect(Player1.letter).to.equal(null);
      expect(Player2.letter).to.equal(null);
      expect(Player1.remaining).to.equal(null);
      expect(Player2.remaining).to.equal(null);
    });

    it("will keep the typed, remaining, and letter properties the same if an invalid key has been pressed", function () {
      Player1.newChar('a');
      expect(Player1.typed).to.equal(null);
      expect(Player1.letter).to.equal(null);
      expect(Player1.remaining).to.equal(null);
    });

    it("if there is no current letter and the input matches a word on the activeWords object, it will 1) set the typed property to the character typed, 2) set the letter property to the next letter of the word, and 3) set the remaining property to the letters of the word that hasn't been typed", function () {
      Player1.newChar('h');
      expect(Player1.typed).to.equal('h');
      expect(Player1.letter).to.equal('e');
      expect(Player1.remaining).to.equal('ello');
    });

    it("if a current letter exists and a different letter is given, the typed, letter, and remaining properties will not change", function () {
      Player1.newChar('h');
      Player1.newChar('z');
      expect(Player1.typed).to.equal('h');
      expect(Player1.letter).to.equal('e');
      expect(Player1.remaining).to.equal('ello');
    });

    it("if a current letter exists and the same letter is given, the typed, letter, and remaining properties will change accordingly", function () {
      Player1.newChar('h');
      Player1.newChar('e');
      expect(Player1.typed).to.equal('he');
      expect(Player1.letter).to.equal('l');
      expect(Player1.remaining).to.equal('llo');
      Player1.newChar('l');
      expect(Player1.typed).to.equal('hel');
      expect(Player1.letter).to.equal('l');
      expect(Player1.remaining).to.equal('lo');
      Player1.newChar('l');
      expect(Player1.typed).to.equal('hell');
      expect(Player1.letter).to.equal('o');
      expect(Player1.remaining).to.equal('o');
    });

//TLEE how can i just check for either null OR undefined
    it("when the last character of a word is typed, set the typed, remaining, and activeWords property of that letter as null/undefined", function () {
      Player1.newChar('h');
      Player1.newChar('e');
      Player1.newChar('l');
      Player1.newChar('l');
      Player1.newChar('o');
      expect(Player1.typed).to.equal(null);
      expect(Player1.letter).to.equal(undefined);
      expect(Player1.remaining).to.equal(null);
      expect(Player1.activeWords.h).to.equal(null);
    })
  })

});

