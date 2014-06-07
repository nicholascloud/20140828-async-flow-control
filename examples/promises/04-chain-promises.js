var q = require('q');

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