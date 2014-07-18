'use strict';
var Q = require('q');

function changePassword(cb) {
  setTimeout(function () {
    console.log('changing password...');
    cb(null);
  }, 500);
}

var fail = true;
function notifyUser(cb) {
  setTimeout(function () {
    console.log('notifying user...');
    cb(fail ? new Error('fail!') : null);
  }, 1000);
}

function sendToNSA(cb) {
  setTimeout(function () {
    console.log('sending to NSA...');
    cb(null);
  }, 500);
}

var steps = [changePassword, notifyUser, sendToNSA];
var lastPromise = Q();
steps.forEach(function (step) {
  lastPromise = lastPromise.then(function () {
    var deferred = Q.defer();
    step(deferred.makeNodeResolver());
    return deferred.promise;
  });
});

lastPromise.done(function () {
  console.log('all done');
}, function (err) {
  console.error(err);
});


