'use strict';
var async = require('async');

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

async.parallel([
  getUser.bind(null, 100),
  getUSStates
], function (err, results) {
  console.log('user', results[0]);
  console.log('states', results[1]);
});