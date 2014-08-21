#!/Users/nicholascloud/nvm/v0.11.13/bin/node --harmony
'use strict';
var co = require('co'),
  thunkify = require('thunkify');

var f1 = thunkify(function f1(cb) { // f1() => f(cb)
  cb(null, 1);
});

var f2 = thunkify(function f2(num, cb) { // f2(num) => f(cb)
  cb(null, num + 2);
});

var f3 = thunkify(function f3(num, cb) { // f3(num) => f(cb)
  cb(null, num + 3);
});

// You may only yield a function, promise, generator, array, or object
co(function *() {
  var num1 = yield f1(); //cb() => 1
  var num2 = yield f2(num1); //cb() => 3
  var num3 = yield f3(num2); //cb() => 6
  console.log(num3);
})();
