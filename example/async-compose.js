'use strict';
var async = require('async');
var moment = require('moment');

function govtExtortion(bill, cb) {
  console.log('adding govt extortion');
  setTimeout(function () {
    bill.total = bill.total * 1.08;
    console.log(bill.total);
    cb(null, bill);
  }, 500);
}

function prorate(bill, cb) {
  console.log('prorating bill');
  if (!bill.plan.isNew) {
    return cb(null, bill);
  }
  setTimeout(function () {
    bill.plan.isNew = false;
    var days = moment().daysInMonth();
    var amtPerDay = bill.plan.billAmt / days;
    var prorateAmt = ((bill.plan.billDay - 1) * amtPerDay);
    bill.total -= prorateAmt;
    console.log(bill.total);
    cb(null, bill);
  }, 1200);
}

function carrierFee(bill, cb) {
  console.log('adding carrier fee');
  setTimeout(function () {
    bill.total += 10;
    console.log(bill.total);
    cb(null, bill);
  }, 700);
}

function createBill(plan, cb) {
  console.log('creating bill');
  setTimeout(function () {
    var bill = {
      plan: plan,
      total: 100
    };
    console.log(bill.total);
    cb(null, bill);
  }, 200);
}

var plan = {
  type: 'Lots of Cell Minutes Plan!+',
  isNew: true,
  billDay: 15,
  billAmt: 100
};

var composed = async.compose(
  govtExtortion,
  prorate,
  carrierFee,
  createBill
);

composed(plan, function (err, bill) {
  if (err) {
    return console.error(err);
  }
  console.log('$', bill.total.toFixed(2));
});