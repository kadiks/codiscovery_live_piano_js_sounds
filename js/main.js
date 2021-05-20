var context = new AudioContext();
var o = null;
var g = null;

const playAll = (notes = []) => {
  notes.reduce(async (previousPromise, opts) => {
    await previousPromise;

    let note;
    let delay;
    if (typeof opts === "string") {
      note = opts;
      delay = 500;
    } else {
      note = opts.note;
      delay = opts.delay;
    }

    return playNoteP(note, delay);
  }, Promise.resolve());

  // notes.forEach((note, index) => {
  //   setTimeout(() => {
  //     playNote(note);
  //   }, index * 500);
  // });
};

function playFrequency(frequency, type) {
  o = context.createOscillator();
  g = context.createGain();
  o.type = type;
  o.connect(g);
  o.frequency.value = frequency;
  g.connect(context.destination);
  o.start(0);
  g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
}

// const playNoteP = (note) => new Promise(() => {

// });

const playNoteP = (note, delay) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const frenchValues = Object.values(frenchNotes);
      if (frenchValues.includes(note)) {
        const indexFrenchNote = frenchValues.indexOf(note);
        note = Object.keys(frenchNotes)[indexFrenchNote];
      }
      console.log("after french", note);
      pressKey(note);

      const freq = noteMap[note];
      playFrequency(freq, "sine");
      playFrequency(freq, "square");
      playFrequency(freq, "triangle");
      playFrequency(freq, "sawtooth");
      resolve();
    }, delay);
  });

const playNote = async (note) => {
  const frenchValues = Object.values(frenchNotes);
  if (frenchValues.includes(note)) {
    const indexFrenchNote = frenchValues.indexOf(note);
    note = Object.keys(frenchNotes)[indexFrenchNote];
  }
  console.log("after french", note);
  pressKey(note);
  const freq = noteMap[note];
  playFrequency(freq, "sine");
  playFrequency(freq, "square");
  playFrequency(freq, "triangle");
  playFrequency(freq, "sawtooth");
};

const pressKey = (id) => {
  const el = document.querySelector(`#${id}`);
  if (!el) {
    return;
  }
  el.classList.add("active");
  setTimeout(() => {
    el.classList.remove("active");
  }, 200);
};

document.querySelector("body").addEventListener("click", ({ target }) => {
  if (!target.matches(".anchor")) {
    return;
  }
  //   const id = target.getAttribute("id");
  const id = target.id;
  playNote(id);
});

document.addEventListener("keyup", (e) => {
  console.log("key", e.key);
  const key = e.key.toUpperCase();

  if (key === " ") {
    playAll(frereJacques);
    return;
  }
  if (key === "W") {
    playAll(clairDeLaLune);
    return;
  }
  if (key === "Y") {
    playAll(happyBDay);
    return;
  }

  const isInArray = Object.keys(noteMap).includes(key);
  if (!isInArray && key !== "X") {
    return;
  }

  let note = key;
  if (key === "X") {
    note = "C5";
  }
  playNote(note);
});
