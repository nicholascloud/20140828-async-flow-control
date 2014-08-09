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
- ES6 generators (?)

<!-- async.js ------------------------------------------------------------- -->

## async.js

- library with utility functions for dealing with collections and flow control
- callback-driven
- my personal go-to

### async.whilst/doWhilst

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

- Use `async.seq` to create a function wrapper for your pipline that can be passed to other code 

see: example/async-seq.js

### async.queue (batch flow)

- a __variable number of workers__ execute the same function on a collection of items
- only MAX number of workers may be executing at once

![async queue](queue-animation.gif)

see: example/async-queue.js

### async.cargo (batch flow)

- a single worker executes the same function on __a variable subset__ of items in a collection
- only a MAX number of items may be worked with at once

see: example/async-cargo.js

<!-- Q promises ----------------------------------------------------------- -->

## Q

- library that implements the [Promises/A+ spec](http://promisesaplus.com/)
- additional methods specifically for interfacing with node.js code (callbacks)
- can handle thrown exceptions

#### promise chain + Q.makeNodeResolver() (series flow)

- executes functions in order
- if any fail, series is aborted and err passed to last promise done() error callback

see: example/q-series.js

#### Q.[all|allSettled] + Q.[fcall|fapply|nfcall|nfapply] (parallel flow)

- immediately executes all functions asynchronously
- all function results passed to resolved callback
- if any function fails, error passed to rejected callback and function results ignored

see: example/q-parallel.js

#### promise chain + Q.makeNodeResolver() (pipeline flow)

see: example/q-pipeline.js


#### Q.[all|allSettled](.spread) + ?

<!-- Events --------------------------------------------------------------- -->

## Events

### EventEmitter

- EventEmitter/EventEmitter2
- event objects encapsulate operations
- may be raised asynchronously
- downside: subscriptions must happen before events are fired

see: example/event-series.js

see: example/event-pipeline.js


<!-- ES6 generators ------------------------------------------------------- -->

## ES6 Generators

### co + thunkify



