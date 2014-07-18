'use strict';
var Q = require('q');

function getUser(id, cb) {
  setTimeout(function () {
    cb(null, {id: id, name: 'nick'});
  }, 500);
}

function getUSStates(cb) {
  setTimeout(function () {
    cb(null, ['MO', 'IL']);
  }, 2000);
}

Q.all([
  Q.nfcall(getUser, 123),
  Q.nfcall(getUSStates)
]).then(function (user, states) {
  console.log(arguments);
}, function (err) {
  console.error('ERR', err);
});