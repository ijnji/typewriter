// describe ('WordFactory', function () {

//   //load our Angular application from scratch
//   beforeEach(module('TypeWriterApp'));

//   var $httpBackend, PlayerFactory;

//  //TLEE note: clarify how this works with kate
//   beforeEach('Get tools', inject(function (_$httpBackend_, _PlayerFactory_) {
//     $httpBackend = _$httpBackend_;
//     PlayerFactory = _PlayerFactory_;
//   }));

//   beforeEach(function () {
//     Player1 = new PlayerFactory.Player('123');
//     Player2 = new PlayerFactory.Player('456');
//   })

//   afterEach(function(){
//     try {
//       //verifies all the requests via expect were made
//       $httpBackend.verifyNoOutstandingExpectation(false);
//       //checks that $httpbackend andled all expected calls
//       $httpBackend.verifyNoOutstandingRequest();
//     } catch (err) {
//       this.test.error(err);
//     }
//   });
//   it('is an object', function () {
//     expect(PlayerFactory).to.be.an('object');
//     console.log(Player1);
//   });

//   describe('addWord', function (){
//     it('should exist', function() {
//       expect (Player1.addWord).toBeDefined();
//     })
//   });

// });
