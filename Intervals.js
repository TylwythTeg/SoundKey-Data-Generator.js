const Utils = require('./Utils.js');

const noteRegExp = "[A-G]";
const intervalDigitRegExp = "[1,2,3,4,5,6,7,8,9,10,11,12,13]+";
const accidentalRegExp = "[#,b]+";

const intervals = [];

function Interval(name) {
    this.name = name;
    intervals.push(this);
    this.value = intervals.indexOf(this);
}

Interval.prototype.flat = function() {
    var value = (this.value - 1) % 12;
    return intervals[value];
};

Interval.prototype.sharp = function() {
    var value = (this.value + 1) % 12;
    return intervals[value];
};

Interval.prototype.plus = function(intervalString) {
  const accidentalString = intervalString.match(accidentalRegExp)[0];
  const accidentalValue = Intervals.getAccidentalValue(accidentalString);
  const referenceIntervalString = intervalString.match(intervalDigitRegExp)[0];
  const referenceInterval = Intervals.fromName(referenceIntervalString);
  const sum = accidentalValue + referenceInterval.value + this.value;

  const noChange = ((sum % 12) === 0);
  if (noChange) {return this;}

  // code below here running means there was a change
  var value;
  if (sum < 0) {
    value = 12 + (sum % 12);
  } else {
    value = (sum % 12);
  }
  return Intervals.fromValue(value);
};

var names = [
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

(function buildNotes() {
    names.forEach(function(str) {
        Interval[str] = new Interval(str);
    });
})();

/* Export */
var Intervals = {};
Intervals.list = intervals;

Intervals.fromName = function(name) {
    return Utils.Array.getFrom("name", name, intervals);
};

Intervals.fromValue = function(value) {
    return Utils.Array.getFrom("value", value, intervals);
};


Intervals.getAccidentalValue = function(accidentalString) {
    var count = 0;
    for (i in accidentalString) {
        var char = accidentalString[i];

        if (char === "#") {
            count++;
        } else if (char === "b") {
            count--;
        } else {
           throw new TypeError("accidentalString must only have # and b characters");
        }
    }
    return count;
}



module.exports = Intervals;

console.log(Intervals.fromName("2").plus("bb7"));
