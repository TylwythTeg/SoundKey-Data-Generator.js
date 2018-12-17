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



Interval.value = function(intervalString) {
    var referenceInterval = intervalString.match(intervalDigitRegExp)[0];
    var referenceIntervalObject = Intervals.fromName(referenceInterval);
    var referenceValue = referenceIntervalObject.value;

    var accidental = intervalString.match(accidentalRegExp)[0];
    var accidentalValue = Intervals.getAccidentalValue(accidental);

    if (instruction === 0) {
        return referenceValue;
    }

    var instruction = accidentalValue < 0 ? "flat" : "sharp";

    var count = Math.abs(accidentalValue);
    var newInterval = null;
    for (var i = 0; i < count; i++) {
        newInterval = referenceIntervalObject[instruction]();
    }
    return newInterval.value;
};



module.exports = Intervals;
