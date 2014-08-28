# Mastering asynchronous control flow in JavaScript (or how to avoid callback hell)

Nicholas Cloud


<!-- Introduction --------------------------------------------------------- -->

## Two models of flow control

- synchronous code
    - return value
    - throw exception on error
- async code
    - returns immediately without value
    - thrown exception won't get caught by calling code
    - callbacks used to "continue" execution flow when error/value is ready (continuation style passing)

## Callbacks

- manual error propagation
- prone to nesting
- invoked within "catch" blocks can be problematic
- inconsistent signatures
    - no real standard other than node callback pattern
    - node callback pattern not always honored
    - contention when adapting other APIs (do we follow the node pattern or the native API pattern?)
- necessary, but we can be more efficient

## Coping strategies

- async.js
- Q promises
- Events
- ES6 generators

## Flows

- sequential (one-at-a-time, no dependency)
- parallel (many-at-a-time, no dependency)
- pipeline (one-at-a-time, dependency)
- batch (many-at-a-time, no dependency)


<!-- async.js ------------------------------------------------------------- -->

## async.js

- library with utility functions for dealing with collections and flow control
- callback-driven
- will not automagically make all your functions async!
- my personal go-to

### async.series (sequential flow)

- executes functions in order
- if any fail, series is aborted and err passed to series callback

See: example/async-series.js

### async.parallel (parallel flow)

- immediately executes all functions asynchronously
- aggregates individual results in a single results array
- if any function fails, final callback invoked with error and all function results ignored

see: example/async-parallel.js

### async.waterfall (pipeline flow)

- functions executed in sequence
- results from previous function passed as arguments to next function
- if any function errors, final callback invoked with error and waterfall execution suspended

see: example/async-waterfall.js

### async.seq (pipeline flow)

- use `async.seq` to create a function wrapper for your pipline
- differes from `async.waterfall` in that it returns a function that must be invoked to start the sequence

see: example/async-seq.js

### async.queue (batch flow)

- a _variable number of workers_ execute the same function on a collection of items
- only MAX number of workers may be executing at once

![async queue](https://i.imgur.com/FTMkZ1D.gif)

see: example/async-queue.js

### async.cargo (batch flow)

- a single worker executes the same function on _a variable subset_ of items in a collection
- only a MAX number of items may be worked with at once

see: example/async-cargo.js


<!-- Q promises ----------------------------------------------------------- -->

## Q

- library that implements the [Promises/A+ spec](http://promisesaplus.com/)
- additional methods specifically for interfacing with node.js code (callbacks)
- can handle thrown exceptions

#### promise chain + Q.makeNodeResolver() (sequential flow)

- executes functions in order
- if any fail, series is aborted and err passed to last promise done() error callback

see: example/q-series.js

#### promise chain + Q.makeNodeResolver() (pipeline flow)

see: example/q-pipeline.js

#### Q.all + Q.nfcall (parallel flow)

- immediately executes all functions asynchronously
- all function results passed to resolved callback
- if any function fails, error passed to rejected callback and function results ignored

see: example/q-parallel.js


<!-- Events --------------------------------------------------------------- -->

## Events

### EventEmitter (sequential/pipeline)

- EventEmitter/EventEmitter2
- event objects encapsulate operations
- may be raised asynchronously
- downside: subscriptions must happen before events are fired

see: example/event-series.js

see: example/event-pipeline.js


<!-- ES6 generators ------------------------------------------------------- -->

## ES6 Generators

- generators are "resumable functions"
- when a generator yields a value, it is made available to code calling the generator function
- when a generator is resumed, it picks up where it last yielded, and *any value passed into the next iteration is used in place of the last yield statement*

### thunkify + co

#### thunkify

- takes a callback-based async function and turns it into a function that *returns another function that accepts the final callback* (the "thunk")

```javascript
function add(a, b, cb) { /*... */ }
var thadd = thunkify(add); //function thadd(a, b) { /*...*/ }
var result = thadd(1, 2); //function (cb) { /*...*/ }
result(function (err, value) { /*...*/ }) //value === 3
```

#### co (pipeline flow)

- together with thunkify lets us write asynchronous code that looks synchronous
- invokes a generator until it is done, feeding the result from all yielded thunks back to the generator as values
- similar to `async` and `await` in C#

see: example/generator-waterfall.js

