#!/Users/nicholascloud/nvm/v0.10.29/bin/node
'use strict';
require('colors');
var async = require('async');
var http = require('http');

var urls = [ // 9 urls
  'http://www.appendto.com',
  'http://www.nodejs.org',
  'http://www.npmjs.org',
  'http://www.nicholascloud.com',
  'http://www.devlink.net',
  'http://javascriptweekly.com',
  'http://nodeweekly.com',
  'http://www.reddit.com/r/javascript',
  'http://www.reddit.com/r/node'
];

var MAX_WORKERS = 3;

var results = {};

var queue = async.queue(function (url, cb) {
  results[url] = '';
  http.get(url, function (res) {
    results[url] = res.statusCode + ' Content-Type: ' + res.headers['content-type'];
    cb();
  }).on('error', function (e) {
    cb(e);
  });
}, MAX_WORKERS);

queue.saturated = function () {
  console.log(('queue is saturated at ' + queue.length()).yellow);
};

queue.empty = function () {
  console.log('queue is empty; last task being handled'.yellow);
};

queue.drain = function () {
  console.log('queue is drained; no more tasks to handle'.blue);
  Object.keys(results).forEach(function (url) {
    console.log(url, results[url]);
  });
  process.exit(0);
};

urls.forEach(function (url) {
  queue.push(url, function () {
    console.log('done processing', url);
  });
});