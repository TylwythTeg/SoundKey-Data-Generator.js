const Interval = require('./Intervals.js');
const Utils = require('./Utils.js');

const noteRegExp = "[A-G]";
const accidentalRegExp = "[#,b]+";
const intervalDigitRegExp = "[1,2,3,4,5,6,7,8,9,10,11,12,13]+";


const notes = [];

/* Note */
function Note(name) {
    this.name = name;
    notes.push(this);
    this.value = notes.indexOf(this);
}

Note.prototype.flat = function() {
    const isFirstNote = (this.value === 0);
    const getLast = (notes.length - 1);
    const defaultCase = (this.value - 1) % 12;

    const value = isFirstNote ? getLast : defaultCase;
    return notes[value];
  };

  Note.prototype.sharp = function() {
    const isLastNote = (this.value === (notes.length -1));
    const getFirst = 0;
    const defaultCase = ((this.value - 1) % 12);

    const value = isLastNote ? getFirst : defaultCase;
    return notes[value];
  };

  /* note.plus("bb7") */
  Note.prototype.plus = function(intervalString) {
    const accidentalString = intervalString.match(accidentalRegExp)[0];
    const accidentalValue = Interval.getAccidentalValue(accidentalString);
    const referenceIntervalString = intervalString.match(intervalDigitRegExp)[0];
    const referenceInterval = Interval.fromName(referenceIntervalString);
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
    return Notes.fromValue(value);
  };

var names = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#"
];

(function buildNotes() {
    names.forEach(function(str) {
        Note[str] = new Note(str);
    });
})();

/* Export */
var Notes = {};
Notes.list = notes;



Notes.fromName = function(name) {
    var note = fromCustomName(name);
    note = Object.create(note);
    return note;
};

Notes.fromValue = function(value) {
    return Utils.Array.getFrom("value", value, notes);
};

/* Accepts [A-G] + (b|#)? */
function fromNormalizedName(name) {
  return Utils.Array.getFrom("name", name, notes);
}

/* Accepts [A-G] + any sequence of #s or bs */
function fromCustomName(str) {
  const referenceNoteString = str.match(noteRegExp)[0];
  const referenceNote = fromNormalizedName(referenceNoteString);
  const accidentalString = str.match(accidentalRegExp)[0];
  const accidentalValue = Interval.getAccidentalValue(accidentalString);

  var index = (referenceNote.value + accidentalValue) % 12;
  return notes[index];
}

module.exports = Notes;

// Test space

console.log(Notes.list);
console.log(Notes.fromName("G###").name);
console.log(Notes.fromName("F#").plus("b6"));
console.log(Notes.fromName("F#").plus("bb7"));
console.log(Notes.fromName("A#").plus("##7"));
