'use strict';
var async = require('async');

var comp = async.compose(function f1 (val, cb) {
  console.log('f1', val);
  cb(null, 1);
}, function f2 (val, cb) {
  console.log('f2', val);
  cb(null, 2);
}, function f3 (val, cb) {
  console.log('f3', val);
  cb(null, 3);
});

comp(4, function f4 (err, val) {
  console.log('f4', val);
});

//f3 4
//f2 3
//f1 2
//f4 1