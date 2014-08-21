#!/Users/nicholascloud/nvm/v0.10.29/bin/node
'use strict';
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var util = require('util');

var slice = function (target) {
  var args = Array.prototype.slice.call(arguments, 1);
  return Array.prototype.slice.apply(target, args);
};

function OpEvent(fn) {
  EventEmitter2.call(this);
  this.fn = fn;
}

util.inherits(OpEvent, EventEmitter2);

OpEvent.prototype.start = function () {
  this.fn(this._makeCb());
};

OpEvent.prototype._makeCb = function () {
  var self = this;
  return function (err /*arg1, arg2, arg3...*/ ) {
    if (err) {
      return self.emit('err', err);
    }
    var args = ['end'].concat(slice(arguments, 1));
    // ['end', arg1, arg2, arg3...]
    self.emit.apply(self, args);
  };
};

OpEvent.series = function (tasks) {
  /*
   * OuterOpEvent (
   *   InnerOpEvent1(func1).start()
   *   InnerOpEvent2(func2).start()
   *   InnerOpEvent3(func3).start()
   *   OuterOpEvent.emit('end')
   * ).start()
   */
  return new OpEvent(function (cb) {
    function loop() {
      if (!tasks.length) {
        console.info('\tno more funcs');
        return cb(null);
      }

      var op = new OpEvent(tasks.shift());
      op.once('err', function (err) {
        console.info('\tfunc^err');
        cb(err);
      }).once('end', function () {
        console.info('\tfunc^end');
        loop();
      });
      op.start();
    }
    loop();
  });
};

var tasks = [
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

var series = OpEvent.series(tasks);
series.once('end', function () {
  console.info('all funcs completed');
});
series.once('err', function (err) {
  console.error('funcs errd', err);
});
series.start();


