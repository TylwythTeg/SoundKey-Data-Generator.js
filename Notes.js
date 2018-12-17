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
Note.prototype.flat = Interval.flat.bind(this);
Note.prototype.sharp = Interval.sharp.bind(this);
Note.prototype.plus = Interval.plus.bind(this);
Note.prototype.minus = Interval.minus.bind(this);

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

Note.prototype.fromName = Note.prototype.fromName;
Note.prototype.fromValue= Note.prototype.fromValue;
Note.fromName = Note.prototype.fromName;

module.exports = Notes;

// Test space

console.log(Notes.list);
console.log(Note.fromName("G###").name);
console.log(Note.fromName("F#").plus("b6"));
console.log(Note.fromName("F#").plus("bb7"));
console.log(Note.fromName("A#").plus("##7"));
