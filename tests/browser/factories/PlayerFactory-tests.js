function mockDateNow() {
   // mock now = 1462361249717ms = 4th May 2016
   return 1462361249717;
}

const originalDateNow = Date.now;
Date.now = mockDateNow;

var ans = [{text: 'hello', end: Date.now() + 10000}, {text: 'zoo', end: Date.now() + 4000}, {text: 'elephant', end: Date.now() + 7000}];

describe('PlayerFactory', function() {

    var Player1, Player2;

    //load our Angular application from scratch
    beforeEach(module('TypeWriterApp'));

    var $httpBackend, PlayerFactory;

    //TLEE note: clarify how this works with kate
    beforeEach('Get tools', inject(function(_$httpBackend_, _PlayerFactory_) {
        $httpBackend = _$httpBackend_;
        PlayerFactory = _PlayerFactory_;
        //WordFactory = _WordFactory_;
    }));

    beforeEach(function() {
        Player1 = new PlayerFactory.Player('123');
        Player2 = new PlayerFactory.Player('456');
        Player1.addWord('hello', 10);
        Player1.addWord('zoo', 4);
        Player1.addWord('elephant', 7);
    })

    afterEach(function() {
        try {
            //verifies all the requests via expect were made
            $httpBackend.verifyNoOutstandingExpectation(false);
            //checks that $httpbackend andled all expected calls
            $httpBackend.verifyNoOutstandingRequest();
        } catch (err) {
            this.test.error(err);
        }
    });

    it('is an object', function() {
        expect(PlayerFactory).to.be.an('object');
    });

    describe('addWord', function() {
        it('is a function', function() {
            expect(Player1.addWord).to.be.a('function');
        });

        it('adds objects with words and time to activeWords', function () {
          expect(Player1.activeWords).to.be.a('array');
          expect(Player2.activeWords).to.deep.equal([]);
          console.log(Player1.activeWords);
          // var ans = [{text: 'hello', end: Date.now() + 10000}, {text: 'zoo', end: Date.now() + 4000}, {text: 'elephant', end: Date.now() + 7000}];
          // console.log(ans);
          expect(Player1.activeWords).to.deep.equal([{text: 'hello', end: Date.now() + 10000}, {text: 'zoo', end: Date.now() + 4000}, {text: 'elephant', end: Date.now() + 7000}]);
        })
    });

   describe('incrementStreak', function() {
        it('is a function', function() {
            expect(Player1.incrementStreak).to.be.a('function');
        });
        it('increases the streak number of a player each time it is invoked', function(){
          expect(Player1.streak).to.equal(0);
          Player1.incrementStreak();
          expect(Player1.streak).to.equal(1);
          Player1.incrementStreak();
          Player1.incrementStreak();
          Player1.incrementStreak();
          expect(Player1.streak).to.equal(4);
        })
    });


   describe('resetStreak', function() {
        it('is a function', function() {
            expect(Player1.resetStreak).to.be.a('function');
        });
        it('resets the streak of a player to 0', function() {
            Player1.incrementStreak();
            expect(Player1.streak).to.equal(1);
            Player1.resetStreak();
            expect(Player1.streak).to.equal(0);

        });
    });

   describe('newChar', function() {
        it('is a function', function() {
            expect(Player1.newChar).to.be.a('function');
        });
        it('stores letters to the word key when typed', function() {
            expect(Player1.word).to.equal('');
            Player1.newChar('z');
            expect(Player1.word).to.equal('z');
            Player1.newChar('o');
            Player1.newChar('o');
            expect(Player1.word).to.equal('zoo');
        });
    });

   describe('removeChar', function() {
        it('is a function', function() {
            expect(Player1.removeChar).to.be.a('function');
        });
        it('stores letters to the word key when typed', function() {
            expect(Player1.word).to.equal('');
            Player1.newChar('z');
            Player1.newChar('o');
            Player1.newChar('o');
            expect(Player1.word).to.equal('zoo');
            Player1.removeChar();
            expect(Player1.word).to.equal('zo');
            Player1.removeChar();
            Player1.removeChar();
            expect(Player1.word).to.equal('');
        });

    });

   describe('validateInput', function() {
        it('is a function', function() {
            expect(Player1.validateInput).to.be.a('function');
        });

        it('removes the word from the active words array when word key matches any of the words in the array', function () {
          Player1.word = 'hello';
          Player1.validateInput();
          expect(Player1.activeWords).to.deep.equal([{text: 'zoo', end: Date.now() + 4000}, {text: 'elephant', end: Date.now() + 7000}])


        })
        it('leaves the active word array alone if no match is found', function () {

          Player1.word = 'zop';
          Player1.validateInput();
          expect(Player1.activeWords).to.deep.equal([{text: 'hello', end: Date.now() + 10000}, {text: 'zoo', end: Date.now() + 4000}, {text: 'elephant', end: Date.now() + 7000}])
        });
        it('clears the word regardless of what the word increases', function () {

        })
    });

   describe('clearWord', function() {
        it('is a function', function() {
            expect(Player1.clearWord).to.be.a('function');
        });
        it('sets the word key to an empty string', function() {
            Player1.newChar('z');
            Player1.newChar('o');
            Player1.newChar('o');
            expect(Player1.word).to.equal('zoo');
            Player1.clearWord();
            expect(Player1.word).to.equal('');
        });
    });

   describe('showAccuracy', function() {
        it('is a function', function() {
            expect(Player1.showAccuracy).to.be.a('function');
        });
    });

   describe('wordsPerMinute', function() {
        it('is a function', function() {
            expect(Player1.wordsPerMinute).to.be.a('function');
        });
    });
});
