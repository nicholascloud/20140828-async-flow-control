var q = require('q');

function performAsyncAction() {
  var deferred = q.defer(),
    promise = deferred.promise;

  var times = 0,
    maxTimes = 3;

  var interval = setInterval(function () {
    if (++times < maxTimes) {
      return deferred.notify(times);
    }
    clearInterval(interval);
    deferred.resolve();
  }, 1000);

  return promise;
}

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