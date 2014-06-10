var async = require('async');

async.series([
  function task1 (cb) {
    console.log('task1');
    cb(null, 1);
  },
  function task2 (cb) {
    console.log('task2');
    cb(null, 2);
  },
  function task3 (cb) {
    console.log('task3');
    cb(null, 3);
  }
], function (err, results) {
  console.log(err, results);
});