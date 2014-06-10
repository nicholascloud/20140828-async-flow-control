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



## Promises

__References__
- [Promises/A+](https://promises-aplus.github.io/promises-spec/)
- [You're missing the point of promises](http://domenic.me/2012/10/14/youre-missing-the-point-of-promises/)
- [kriskowal/q](https://github.com/kriskowal/q)

__Slides__

### [+] No empty promises!

- objects
- represent the _state_ of an asynchronous operation
	- pending
	- rejected
	- fulfilled
- hold the value of a successful asynchronous operation
- hold the error of a failed asynchronous operation

### [+] Creation

- (mostly) created by _deferreds_
- deferreds:
	- hold a reference to the promise they create
	- expose the API for rejecting or fulfilling a promise (changing its state)
	- never returned to calling code
- promises:
	- expose `then()` method for attaching callbacks to be called when rejected/fulfilled
	- always returned to calling code

### [+] Encapsulate asynchronous operations so we can treat them as synchronous

```javascript
function performAsyncAction () {
  var deferred = q.defer(),
      promise = deferred.promise;
    
  var times = 0,
      maxTimes = 3;
  
  var interval = setInterval(function () {
  if (++times < maxTimes) {
      return deferred.notify(times);
    }
    clearInterval(interval);
    if (Date.now() % 2 === 0) {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  }, 1000);
  
  return promise;
}
```

### [+] Aggregate callbacks so we can deal with success/error conditions in one place

```javascript
var promise = performAsyncAction();

promise.then(function onSuccess () {
  console.log('promise resolved!');  
}, function onError() {
  console.log('promise rejected!');  
}, function onProgress (times) {
  console.log('tried %s times', times);
});
```

### [+] Attach *as many callbacks* as we want to the *same* promise

```javascript
function step3() {
  var promise = performAsyncAction();
  promise.progress(function (times) {
    console.log('tried %s times', times);
  });
  return promise;
}

function step2() {
  var promise = step3();
  promise.then(function () {
    console.log('step2 success');
  });
  return promise;
}

function step1() {
  var promise = step2();
  promise.then(null, function (err) {
    console.error('step1 handling error:', err);
  });
  return promise;
}

step1().done(function () {
  console.log('all steps complete');
});
```

### [+] Chain promises that each have a chance to mutate the initial promise's value, or return a different value altogether

- `then()` always returns a new promise
	- resolved with the return value of the initial promise's resolve handler, or
	- rejected with the return value of the initial promise's reject handler
- "middleware"

```javascript
function performAsyncAction() {
  var deferred = q.defer(),
    promise = deferred.promise;

  var user = {name: 'Jamie'};

  setTimeout(function () {
    deferred.resolve(user);
  }, 200);

  return promise;
}

function step3() {
  var promise = performAsyncAction();
  return promise.then(function (user) {
    if (user.name === 'Jamie') {
      return {name: 'Kingslayer'};
    }
    return user;
  });
}

function step2() {
  var promise = step3();
  return promise.then(function (user) {
    if (user.name === 'Kingslayer') {
      user.numHands = 1;
    }
    return user;
  });
}

function step1() {
  var promise = step2();
  promise.then(function (user) {
    console.log(JSON.stringify(user));
  });
  return promise;
}

step1().done(function () {
  console.log('all steps complete');
});
```



### [+] Resources

- Promises/A+ specification
- Popular libraries
	- q
	- when.js
	- jQuery promises*



## async.js

__References__
- [caolan/async](https://github.com/caolan/async)

__Slides__

### [+] Executing autonomous functions in a particular order

#### [+] series

- runs functions in order
- functions pass an error and/or result to callback
- if any function raises an error, whole process aborted
- results accumulated in an array

```javascript
TODO: example
```

#### [+] parallel

- like series, except run in "parallel" (event loop)

```javascript
TODO: example
```

### [+] Piping the output of functions as input to other functions

#### [+] waterfall

```javascript
TODO: example
```

#### [+] compose

```javascript
TODO: example
```

### [+] Executing functions repeatedly on a particular condition

#### [+] whilst

```javascript
TODO: example
```

#### [+] doWhilst

```javascript
TODO: example
```

### [+] Batch executing functions

#### [+] queue

```javascript
TODO: example
```

#### [+] cargo

```javascript
TODO: example
```

### [+] Repeating a function to accumulate results

#### [+] times

```javascript
TODO: example
```


## Eventing

__References__
- [Events](http://nodejs.org/api/events.html)
- [EventEmitter2](https://github.com/asyncly/EventEmitter2)

__Slides__

### [+] Resources

- EventEmitter2/3
- Ventage


## Message bus (?)

__References__

__Slides__


---
