var q = require('q');

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

var promise = performAsyncAction();

promise.then(function onSuccess () {
  console.log('promise resolved!');
}, function onError() {
  console.log('promise rejected!');
}, function onProgress (times) {
  console.log('tried %s times', times);
});