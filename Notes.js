const Interval = require('./Intervals.js');

const noteRegExp = "[A-G]";
const accidentalRegExp = "[#,b]+";
const names = [
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
const NOTE_COUNT = names.length;

function Note(name) {
    this.name = name;
    Note.list.push(this);
    this.value = Note.list.indexOf(this);
}

Object.defineProperty(Note, "list", {
  value: [],
  writable: false
});

Note.prototype = Object.assign(Note.prototype, Interval.behavior);

Note.fromName = function(name, nameOverride = false) {
    var refNote = fromCustomName(name);
    note = Object.create(refNote);

    if (nameOverride) {
      note.referenceName = refNote.name;
      note.name = name;
    } else {
      note.referenceName = refNote.name;
      note.name = refNote.name;
    }

    return note;
};

Note.fromValue = function(value) {
    return Note.list.find(function(item) {
      return item.value === value;
    });
};

/* Accepts [A-G] + (b|#)? */
function fromNormalizedName(name) {
    return Note.list.find(function(note) {
      return note.name === name;
    });
}

/* Accepts [A-G] + any sequence of #s or bs */
function fromCustomName(str) {
    const referenceNoteString = str.match(noteRegExp)[0];
    const referenceNote = fromNormalizedName(referenceNoteString);
    const accidentalString = str.match(accidentalRegExp)[0];
    const accidentalValue = Interval.getAccidentalValue(accidentalString);

    var index = (referenceNote.value + accidentalValue) % NOTE_COUNT;
    return Note.list[index];
}

(function buildNotes() {
    names.forEach(function(str) {
        Note[str] = new Note(str);
    });
    Object.freeze(Note.list);
})();

module.exports = Note;

// Test space

console.log("Note List:",Note.list);

console.log("G### ===",Note.fromName("G###").name);
console.log("F# + b6 (9+8)",Note.fromName("F#").plus("b6"));
console.log("F# + bb7 (9 + 9)",Note.fromName("F#").plus("bb7"));
console.log("A# + b2 (1+1)",Note.fromName("A#").plus("##7"));
console.log("A# - b4 (1-4)",Note.fromName("A#").minus("b4"));
console.log("A#.flat() (1-1)",Note.fromName("A#").flat());
console.log("A#.flat() (1-1-1)",Note.fromName("A#").flat().flat());
console.log("A# sharp() (1+1)",Note.fromName("A#").sharp());
console.log("A# - b5 (1-6)",Note.fromName("A#").minus("b5"));

console.log("A# - ##7 (1-13)",Note.fromName("A#").minus("##7"));
