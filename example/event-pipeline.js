#!/Users/nicholascloud/nvm/v0.10.29/bin/node
'use strict';
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var util = require('util');

var slice = function (target) {
  var args = Array.prototype.slice.call(arguments, 1);
  return Array.prototype.slice.apply(target, args);
}

function OpEvent(fn) {
  EventEmitter2.call(this);
  this.fn = fn;
}

util.inherits(OpEvent, EventEmitter2);

OpEvent.prototype.start = function (args) {
  if (!Array.isArray(args)) {
    args = slice(arguments);
  }
  args.push(this._makeCb());
  this.fn.apply(null, args);
};

OpEvent.prototype._makeCb = function () {
  var self = this;
  return function (err /*arg1, arg2, arg3...*/ ) {
    if (err) {
      return self.emit('err', err);
    }
    var cbArgs = slice(arguments, 1);
    // ['end', arg1, arg2, arg3...]
    var eventArgs = ['end'].concat(cbArgs);
    self.emit.apply(self, eventArgs);
  };
};

OpEvent.pipeline = function (tasks) {
  return new OpEvent(function (cb) {
    function loop(/*loopArgs*/) {
      var loopArgs = slice(arguments);

      if (!tasks.length) {
        console.info('\tno more funcs');
        return cb.apply(null, [null].concat(loopArgs));
      }

      var op = new OpEvent(tasks.shift());
      op.once('err', function (err) {
        console.info('\tfunc^err');
        cb(err);
      }).once('end', function (/*endArgs*/) {      
        console.info('\tfunc^end');
        var endArgs = slice(arguments);
        loop.apply(null, endArgs);
      });
      op.start(loopArgs);
    }
    loop();
  });
};

var tasks = [
  function x (cb) {
    console.info('func x( )');
    setTimeout(function () {
      cb(null, '>x');
    }, 1000);
  },
  function y (x, cb) {
    console.info('func y(', x, ')');
    setTimeout(function () {
      cb(null, x, '>y');
      //cb(new Error('bad!'));
    }, 700);
  },
  function z (x, y, cb) {
    console.info('func z(', x, y, ')');
    setTimeout(function () {
      cb(null, x, y, '>z');
    }, 1200);
  }
];

var pipeline = OpEvent.pipeline(tasks);
pipeline.once('end', function () {
  console.info('pipeline completed:', arguments);
});
pipeline.once('err', function (err) {
  console.error('pipeline errored:', err);
});
pipeline.start();


