// 'use strict';
// /* globals module inject chai ngEnterDirective */
// var expect = chai.expect;

// /*---------------
//    EXTRA CREDIT
// ----------------*/
// // to enable this extra credit, change `xdescribe` below
// // to just `describe`.

// describe('typewriter directive', function () {
//   // if you are curious how this is being used,
//   // check out line 6 of todo.item.html

//   beforeEach(function () {
//     module('typewriter');

//     inject(function($compile, $rootScope) {
//       complile = $compile;
//       scope = $rootScope.$new();
//     })

//   });

// });



// var compile, scope, directiveElem;

// beforeEach(function(){
//   module('sampleDirectives');

//   inject(function($compile, $rootScope){
//     compile = $compile;
//     scope = $rootScope.$new();
//   });

//   directiveElem = getCompiledElement();
// });

// function getCompiledElement(){
//   var element = angular.element('<div first-directive></div>');
//   var compiledElement = compile(element)(scope);
//   scope.$digest();
//   return compiledElement;
// }
