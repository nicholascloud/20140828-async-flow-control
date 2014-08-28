#!/Users/nicholascloud/nvm/v0.10.29/bin/node
'use strict';
var Q = require('q');

var d = Q.defer(),
  p1 = d.promise;

var p2 = p1.then(function onResolved (n) {
  console.info('p1 resolved', arguments);
  return n + 1;
}, function onRejected (e) {
  console.error('p1 rejected', arguments);
//  return e;
  throw e;
});

var p3 = p2.then(function onResolved () {
  console.info('p2 resolved', arguments);
}, function onRejected (err) {
  console.error('p2 rejected', arguments);
});

p3.done(function () {
  console.log('p3 done');
});

setImmediate(function () {
//  d.resolve(1);
  d.reject(new Error('no moar coffee'));
});