const Interval = require('./Intervals.js');
const Utils = require('./Utils.js');

const noteRegExp = "[A-G]";
const accidentalRegExp = "[#,b]+";


const notes = [];

/* Note */
function Note(name) {
    this.name = name;
    notes.push(this);
    this.value = notes.indexOf(this);
}

Note.prototype.fromName = function(name) {
    var note = fromCustomName(name);
    note = Object.create(note);
    return note;
};

Note.prototype.fromValue = function(value) {
    return Utils.Array.getFrom("value", value, notes);
};
/* Interval extensions */
Note.prototype.flat = function () {
  return Interval.prototype.flat.call(this);
};
Note.prototype.sharp = function () {
  return Interval.prototype.sharp.call(this);
};
Note.prototype.plus = function (str) {
  return Interval.prototype.plus.call(this, str);
};
Note.prototype.minus = function (str) {
  return Interval.prototype.minus.call(this, str);
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

Note.fromName = Note.prototype.fromName;

module.exports = Notes;

// Test space

console.log(Notes.list);
console.log(Note.fromName("G###").name);
console.log(Note.fromName("F#").plus("b6"));
console.log(Note.fromName("F#").plus("bb7"));
console.log(Note.fromName("A#").plus("##7"));
