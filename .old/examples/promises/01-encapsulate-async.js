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
    deferred.resolve();
  }, 1000);

  return promise;
}