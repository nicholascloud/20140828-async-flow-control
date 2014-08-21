#!/Users/nicholascloud/nvm/v0.10.29/bin/node
'use strict';
var Q = require('q');

var d = Q.defer(),
  p = d.promise;

setImmediate(function () {
  d.resolve(1);
//  d.reject(new Error('2'));
});

var p2 = p.then(function (n) {
  console.info('p1+', arguments);
//  return n + 1;
}, function (e) {
  console.error('p1x', arguments);
//  return e;
//  throw e;
});

p2.then(function () {
  console.info('p2+', arguments);
}, function (err) {
  console.error('p2x', arguments);
});