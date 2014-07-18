'use strict';
var async = require('async');

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

async.series([changePassword, notifyUser, sendToNSA], function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('all done');
});