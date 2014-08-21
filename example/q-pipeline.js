#!/Users/nicholascloud/nvm/v0.10.29/bin/node
'use strict';
var Q = require('q');

var hero = {
  health: 30,
  str: 5,
  weapon: {
    dmg: 7,
    threat: [10, 15]
  }
};

var monster = {
  health: 25,
  armor: 15,
  dex: 7
};

function _getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function attemptDefense(attack, critical, cb) {
  console.log('attempting defense...');
  setTimeout(function () {
    var offense = (attack.value + critical);
    var defense = (monster.armor + monster.dex);
    if (offense > defense) {
      monster.health -= hero.weapon.dmg;
      attack.dmg = hero.weapon.dmg;
    }
    cb(null, attack);
  }, 800);
}

function calculateCritical(attack, cb) {
  console.log('caclulating critical...');
  setTimeout(function () {
    var critical = 0;
    var isCriticalHit = (
      attack.roll >= hero.weapon.threat[0] &&
      attack.roll <= hero.weapon.threat[1]
    );
    if (isCriticalHit) {
      critical = (attack.value * 0.15).toFixed(2);
    }
    cb(null, attack, critical);
  }, 300);
}

function startCombat(cb) {
  console.log('starting combat...');
  setTimeout(function () {
    var roll = _getRandomInt(1, 20);
    var attack = {
      roll: roll,
      value: roll + hero.str + hero.weapon.dmg,
      dmg: 0
    };
    cb(null, attack);
  }, 200);
}

function showStats() {
  console.log('stats -- hero', hero.health, 'monster', monster.health);
}

var steps = [
  function preAttack(cb) {
    showStats();
    cb(null);
  },
  startCombat,
  calculateCritical,
  attemptDefense,
  function postAttack(attack, cb) {
    showStats();
    console.log('attack values:', attack);
    cb(null);
  }
];

var lastPromise = Q();
steps.forEach(function (step) {
  lastPromise = lastPromise.then(function (result) {

    var deferred = Q.defer();
    var args = [deferred.makeNodeResolver()];

    // multiple values passed to the callback
    if (Array.isArray(result)) {
      // [r1, r2, ..., cb]
      args = result.concat(args);
    // single value passed to the callback
    } else if (result !== undefined) {
      // [r1, cb]
      args.unshift(result);
    }

    step.apply(null, args);
    return deferred.promise;
  });
});

lastPromise.done(function () {
  console.log('combat complete');
}, function (err) {
  console.error(err);
});