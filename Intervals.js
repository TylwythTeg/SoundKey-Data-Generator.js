const Utils = require('./Utils.js');
const intervalDigitRegExp = "[1,2,3,4,5,6,7,8,9,10,11,12,13]+";
const accidentalRegExp = "[#,b]+";
const names = [
    "1",
    "b2",
    "2",
    "b3",
    "3",
    "4",
    "#4",
    "5",
    "b6",
    "6",
    "b7",
    "7"
];
const INTERVAL_COUNT = names.length;

function Interval(name) {
    this.name = name;
    Interval.list.push(this);
    this.value = Interval.list.indexOf(this);
}

Object.defineProperty(Interval, "list", {
  value: [],
  writable: false
});

Interval.fromName = function(name) {
    return Interval.list.find(function(item) {
      return item.name === name;
    });
};
Interval.fromValue = function(value) {
    return Interval.list.find(function(item) {
      return item.value === value;
    });
};

Interval.prototype.flat = function() {
    return this.minus("b2");
};

Interval.prototype.sharp = function() {
//  console.log(this);
    return this.plus("b2");
};

Interval.prototype.getSum = function(intervalString) {
    const accidentalString = intervalString.match(accidentalRegExp)[0];
    const accidentalValue = Interval.getAccidentalValue(accidentalString);
    const referenceIntervalString = intervalString.match(intervalDigitRegExp)[0];
    const referenceInterval = Interval.fromName(referenceIntervalString);
    const sum = accidentalValue + referenceInterval.value + this.value;

    const noChange = ((sum % INTERVAL_COUNT) === 0);
    if (noChange) {
        return this.value;
    }

    // find destination value since it changed
    var value;
    if (sum < 0) {
        value = INTERVAL_COUNT + (sum % INTERVAL_COUNT);
    } else {
        value = (sum % INTERVAL_COUNT);
    }
    return value;
};

Interval.prototype.getDifference = function(intervalString) {
    var value = Interval.prototype.getSum.call(this, intervalString);
    console.log("val",value);
    console.log("calc",-(value) + (INTERVAL_COUNT));
    return (-(value) + (INTERVAL_COUNT) + this.value+1)% 12;
};

Interval.prototype.plus = function(intervalString) {
    const value = Interval.prototype.getSum.call(this, intervalString);
    const constructor = Object.getPrototypeOf(this).constructor;
    return constructor.fromValue(value);
};

Interval.prototype.minus = function(intervalString) {
    var value = Interval.prototype.getDifference.call(this, intervalString);
    const constructor = Object.getPrototypeOf(this).constructor;
    return constructor.fromValue(value);
};

Interval.getAccidentalValue = function(accidentalString) {
    var count = 0;
    for (i in accidentalString) {
        var char = accidentalString[i];

        if (char === "#") {
            count++;
            continue;
        } else if (char === "b") {
            count--;
            continue;
        }

        throw new TypeError("accidentalString must only have # and b characters");
    }
    return count;
};


Interval.behavior = {
  flat: Interval.prototype.flat,
  sharp: Interval.prototype.sharp,
  minus: Interval.prototype.minus,
  plus: Interval.prototype.plus,
};

(function buildIntervals() {
    names.forEach(function(str) {
        Interval[str] = new Interval(str);
    });
    Object.freeze(Interval.list);
})();

module.exports = Interval;

//console.log(Interval.fromName("2").plus("bb7"));
