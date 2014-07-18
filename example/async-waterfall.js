'use strict';
var async = require('async');

function getUser(cb) {
  console.log('getting user');
  setTimeout(function () {
    cb(null, {
      id: 1,
      name: 'nick',
      dob: new Date(1981, 10, 15)
    })
  }, 500);
}

function calcAge(user, cb) {
  console.log('calcing age for:', user);
  setTimeout(function () {
    var now = Date.now(),
      then = user.dob.getTime();
    var age = (now - then) / (1000 * 60 * 60 * 24 * 365);
    cb(null, Math.round(age));
  }, 1000);
}

function reward(age, cb) {
  console.log('getting reward for age:', age);
  setTimeout(function () {
    switch (age) {
      case 25:
        return cb(null, '$100');
      case 30:
        return cb(null, '$150');
      case 35:
        return cb(null, '$200');
      default:
        return cb(null, '$0');
    }
  }, 700);
}

async.waterfall([
  getUser,
  calcAge,
  reward
], function (err, reward) {
  if (err) {
    return console.error(err);
  }
  console.log('reward:', reward);
});