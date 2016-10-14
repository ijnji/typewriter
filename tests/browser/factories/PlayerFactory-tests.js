describe('PlayerFactory', function() {

    var Player1, Player2;

    //load our Angular application from scratch
    beforeEach(module('TypeWriterApp'));

    var $httpBackend, PlayerFactory;

    //TLEE note: clarify how this works with kate
    beforeEach('Get tools', inject(function(_$httpBackend_, _PlayerFactory_) {
        $httpBackend = _$httpBackend_;
        PlayerFactory = _PlayerFactory_;
    }));

    beforeEach(function() {
        Player1 = new PlayerFactory.Player('123');
        Player2 = new PlayerFactory.Player('456');
        Player1.addWord('hello', 10);
        Player1.addWord('zoo', 4);
        Player1.addWord('elephant', 7);
        console.log(Player1.activeWords);
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
          expect(Player1.activeWords).to.be.equal([{}])
          expect(Player2.activeWords).to.deep.equal([]);
          expect(Player1.activeWords).to.be.equal([{text: 'hello', end: Date.now() + 10000}, {text: 'zoo', end: Date.now() + 4000}, {text: 'elephant', end: Date.now() + 7000}])
        })
    });

   describe('incrementStreak', function() {
        it('is a function', function() {
            expect(Player1.incrementStreak).to.be.a('function');
        });
    });


   describe('resetStreak', function() {
        it('is a function', function() {
            expect(Player1.resetStreak).to.be.a('function');
        });
    });

   describe('newChar', function() {
        it('is a function', function() {
            expect(Player1.newChar).to.be.a('function');
        });
    });

   describe('removeChar', function() {
        it('is a function', function() {
            expect(Player1.removeChar).to.be.a('function');
        });
    });

   describe('validateInput', function() {
        it('is a function', function() {
            expect(Player1.validateInput).to.be.a('function');
        });
    });

   describe('clearWord', function() {
        it('is a function', function() {
            expect(Player1.clearWord).to.be.a('function');
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
