#!/Users/nicholascloud/nvm/v0.10.29/bin/node
'use strict';
var async = require('async');

var userID = 100;

function getUser(cb) {
  console.log('getting user...');
  setTimeout(function () {
    cb(null, {id: userID, name: 'nick'});
  }, 500);
}

function getUSStates(cb) {
  console.log('getting states...');
  setTimeout(function () {
    cb(null, ['MO', 'IL']);
  }, 2000);
}

async.parallel([
  getUser,
  getUSStates
], function (err, results) {
  console.log('user', results[0]);
  console.log('states', results[1]);
});