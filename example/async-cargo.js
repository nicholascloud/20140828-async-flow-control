#!/Users/nicholascloud/nvm/v0.10.29/bin/node
'use strict';
require('colors');
var async = require('async');
var db = require('./fake/db');

var customerUpdates = [ // 9 updates
  {id: 1000, field: 'firstName', value: 'Walter'},
  {id: 1001, field: 'phoneNumber', value: '222-333-4444'},
  {id: 1002, field: 'email', value: 'ncloud@appendto.com'},
  {id: 1003, field: 'dob', value: '01/22/1973'},
  {id: 1004, field: 'city', value: 'Chicago'},
  {id: 1005, field: 'occupation', value: 'Professional Troll'},
  {id: 1006, field: 'twitter', value: '@2cool4school'},
  {id: 1007, field: 'ssn', value: '111-22-3333'},
  {id: 1008, field: 'email', value: 'urmom@internet.com'},
  {id: 1009, field: 'pref', value: 'rememberme=false&colorscheme=dark'}
];

var MAX_PAYLOAD_SIZE = 4;

var cargo = async.cargo(function (updates, cb) {
  var UPDATE_QUERY = "UPDATE CUSTOMER SET ? = '?' WHERE id = ?;";
  db.begin(function (trx) {
    updates.forEach(function (update) {
      var query = UPDATE_QUERY.replace('?', update.field)
        .replace('?', update.value)
        .replace('?', update.id);
      trx.add(query);
    });
    trx.end(function () {
      cb();
    })
  });
}, MAX_PAYLOAD_SIZE);

cargo.saturated = function () {
  console.log(('cargo is saturated at ' + cargo.length()).yellow);
};

cargo.empty = function () {
  console.log('cargo is empty; worker needs tasks'.yellow);
};

cargo.drain = function () {
  console.log('cargo is drained; no more tasks to handle'.blue);
};

customerUpdates.forEach(function (update) {
  cargo.push(update, function () {
    console.log('done processing', update.id);
  });
});