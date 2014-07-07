'use strict';
require('colors');
var EOL = require('os').EOL;

function FakeTransaction() {
  this._statements = [];

  this.add = function (statement) {
    this._statements.push(statement);
  };

  this.toString = function () {
    return this._statements.join(EOL);
  };

  this.end = function (cb) {
    var self = this;
    setTimeout(function () {
      console.log(self.toString().cyan);
      cb();
    }, 900);
  };
}

module.exports = {
  begin: function (cb) {
    var trx = new FakeTransaction();
    cb(trx);
  }
};