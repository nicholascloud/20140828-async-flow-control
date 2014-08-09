// nvm use harmony
// node --harmony generator-waterfall.js
'use strict';
var co = require('co'),
  thunkify = require('thunkify');

var f1 = thunkify(function f1(cb) {
  cb(null, 1);
});

var f2 = thunkify(function f2(num, cb) {
  cb(null, num + 2);
});

var f3 = thunkify(function f3(num, cb) {
  cb(null, num + 3);
});

// You may only yield a function, promise, generator, array, or object
co(function *() {
  var num1 = yield f1(); //cb() => 1
  var num2 = yield f2(num1); //cb() => 3
  var num3 = yield f3(num2); //cb() => 6
  console.log(num3);
})();
