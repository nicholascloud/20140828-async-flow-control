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

OpEvent.prototype.invoke = function () {
  this.fn(this._makeCb());
};

OpEvent.prototype._makeCb = function () {
  var self = this;
  return function (err) {
    if (err) {
      return self.emit('err', err);
    }
    var args = ['end'].concat(slice(arguments, 1));
    self.emit.apply(self, args);
  };
};

OpEvent.series = function (funcs) {
  if (!Array.isArray(funcs)) {
    funcs = slice(arguments);
  }
  return new OpEvent(function (cb) {
    function loop() {
      if (!funcs.length) {
        console.info('\tno more funcs');
        return cb(null);
      }
      var op = new OpEvent(funcs.shift());
      op.once('err', function (err) {
        console.info('\tfunc^err');
        cb(err);
      }).once('end', function () {
        console.info('\tfunc^end');
        loop();
      });
      op.invoke();
    }
    loop();
  });
};

var ops = [
  function x (cb) {
    console.info('func x');
    setTimeout(function () {
      cb(null);
    }, 1000);
  },
  function y (cb) {
    console.info('func y');
    setTimeout(function () {
      cb(null);
      //cb(new Error('bad!'));
    }, 700);
  },
  function z (cb) {
    console.info('func z');
    setTimeout(function () {
      cb(null);
    }, 1200);
  }
];

var series = OpEvent.series(ops);
series.once('end', function () {
  console.info('all funcs completed');
});
series.once('err', function (err) {
  console.error('funcs errd', err);
});
series.invoke();


