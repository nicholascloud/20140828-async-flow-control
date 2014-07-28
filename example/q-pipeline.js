'use strict';
var Q = require('q');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function defend(hero, monster, attack, cb) {
  if (attack.value > (monster.armor + monster.dex)) {
    monster.health -= hero.weapon.dmg;
    attack.dmg = hero.weapon.dmg;
  }
  cb(null, attack);
}

function crit(hero, attack, cb) {
  attack.isCritical = (
    attack.roll >= hero.weapon.threat[0] &&
    attack.roll <= hero.weapon.threat[1]
  );
  if (attack.isCritical) {
    attack.value = (attack.value * 1.15).toFixed(2);
  }
  cb(null, attack);
}

function attack(hero, cb) {
  var roll = getRandomInt(1, 20);
  var attack = {
    roll: roll,
    value: roll + hero.str + hero.weapon.dmg,
    dmg: 0
  };
  cb(null, attack);
}

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

var steps = [
  function preAttack(cb) {
    console.log('hero', hero.health, 'monster', monster.health);
    cb(null);
  },
  attack.bind(null, hero),
  crit.bind(null, hero),
  defend.bind(null, hero, monster),
  function postAttack(attack, cb) {
    console.log('hero', hero.health, 'monster', monster.health, 'result', attack);
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
      args = result.concat(args);
    // single value passed to the callback
    } else if (result !== undefined) {
      args.unshift(result);
    }
    step.apply(null, args);
    return deferred.promise;
  });
});
lastPromise.done(function () {
  console.log('combat complete');
});