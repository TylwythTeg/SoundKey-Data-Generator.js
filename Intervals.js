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
    const isFirst = (this.value === 0);
    const getLast = (this.list.length - 1);
    const defaultCase = (this.value - 1) % 12;

    const value = isFirst ? getLast : defaultCase;
    return this.fromValue[value];
};

Interval.prototype.sharp = function() {
    const isLast = (this.value === (this.list.length - 1));
    const getFirst = 0;
    const defaultCase = ((this.value - 1) % 12);

    const value = isLast ? getFirst : defaultCase;
    return this.fromValue(value);
};

Interval.prototype.getSum = function(intervalString) {
    const accidentalString = intervalString.match(accidentalRegExp)[0];
    const accidentalValue = Intervals.getAccidentalValue(accidentalString);
    const referenceIntervalString = intervalString.match(intervalDigitRegExp)[0];
    const referenceInterval = Intervals.fromName(referenceIntervalString);
    const sum = accidentalValue + referenceInterval.value + this.value;

    const noChange = ((sum % 12) === 0);
    if (noChange) {
        return this.value;
    }

    // find destination value since it changed
    var value;
    if (sum < 0) {
        value = 12 + (sum % 12);
    } else {
        value = (sum % 12);
    }
    return value;
};

Interval.prototype.getDifference = function(intervalString) {
    var value = Interval.getSum(intervalString).bind(this);
    return -value + 12;
};

Interval.prototype.plus = function(intervalString) {
    const value = this.getSum(intervalString);
    return Intervals.fromValue(value);
};

Interval.prototype.minus = function(intervalString) {
    var value = this.getDifference(intervalString);
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
};


Intervals.getSum = Interval.prototype.getSum;
Intervals.getDifference = Interval.prototype.getDifference;



module.exports = Intervals;

console.log(Intervals.fromName("2").plus("bb7"));
