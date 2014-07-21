# Mastering asynchronous control flow in JavaScript (or how to avoid callback hell)

Nicholas Cloud

---

## The event loop

__References__
- [Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/EventLoop)

__Slides__

## Callbacks

__References__
- [Continuation-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style)

__Slides__

### [+] "Continuation-passing style"

### [+] Continuations as objects


## Flows


### linear


### branching


### loops

#### async.whilst/doWhilst


### series

#### async.series

```javascript
'use strict';
var async = require('async');

function changePassword(cb) {
  setTimeout(function () {
    console.log('changing password...');
    cb(null);
  }, 500);
}

var fail = true;
function notifyUser(cb) {
  setTimeout(function () {
    console.log('notifying user...');
    cb(fail ? new Error('fail!') : null);
  }, 1000);
}

function sendToNSA(cb) {
  setTimeout(function () {
    console.log('sending to NSA...');
    cb(null);
  }, 500);
}

async.series([changePassword, notifyUser, sendToNSA], function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('all done');
});
```

#### promise chain + Q.makeNodeResolver()

```javascript
'use strict';
var Q = require('q');

function changePassword(cb) {
  setTimeout(function () {
    console.log('changing password...');
    cb(null);
  }, 500);
}

var fail = true;
function notifyUser(cb) {
  setTimeout(function () {
    console.log('notifying user...');
    cb(fail ? new Error('fail!') : null);
  }, 1000);
}

function sendToNSA(cb) {
  setTimeout(function () {
    console.log('sending to NSA...');
    cb(null);
  }, 500);
}

var steps = [changePassword, notifyUser, sendToNSA];
var lastPromise = Q();
steps.forEach(function (step) {
  lastPromise = lastPromise.then(function () {
    var deferred = Q.defer();
    step(deferred.makeNodeResolver());
    return deferred.promise;
  });
});

lastPromise.done(function () {
  console.log('all done');
}, function (err) {
  console.error(err);
});
```


### parallel

#### async.parallel

```javascript
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
```

#### Q.[all|allSettled] + Q.[fcall|fapply|nfcall|nfapply]

```javascript
var Q = require('q');

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

Q.all([
  Q.nfcall(getUser, 123),
  Q.nfcall(getUSStates)
]).then(function (user, states) {
  console.log(arguments);
}, function (err) {
  console.error('ERR', err);
});
```


### pipeline

#### async.waterfall

```javascript
'use strict';
var async = require('async');

function getUser(cb) {
  console.log('getting user');
  setTimeout(function () {
    cb(null, {
      id: 1,
      name: 'nick',
      dob: new Date(1981, 10, 15)
    })
  }, 500);
}

function calcAge(user, cb) {
  console.log('calcing age for:', user);
  setTimeout(function () {
    var now = Date.now(),
      then = user.dob.getTime();
    var age = (now - then) / (1000 * 60 * 60 * 24 * 365);
    cb(null, Math.round(age));
  }, 1000);
}

function reward(age, cb) {
  console.log('getting reward for age:', age);
  setTimeout(function () {
    switch (age) {
      case 25:
        return cb(null, '$100');
      case 30:
        return cb(null, '$150');
      case 35:
        return cb(null, '$200');
      default:
        return cb(null, '$0');
    }
  }, 700);
}

async.waterfall([
  getUser,
  calcAge,
  reward
], function (err, reward) {
  if (err) {
    return console.error(err);
  }
  console.log('reward:', reward);
});
```

#### async.seq

- Use `async.seq` to create a function wrapper for your pipline that can be passed to other code 

```javascript
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

var seq = async.seq(
  createBill,
  carrierFee,
  prorate,
  govtExtortion
);

//bill = govtExtortion(prorate(carrierFee(createBill(plan))))
seq(plan, function (err, bill) {
  if (err) {
    return console.error(err);
  }
  console.log('$', bill.total.toFixed(2));
});
```

#### promise chain + Q.makeNodeResolver()

```javascript

```


### batching

#### async.queue

#### async.cargo

#### Q.[all|allSettled](.spread) + ?


### eventing

#### Q.notify

#### EventEmitter