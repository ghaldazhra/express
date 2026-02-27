let notes = [
  {
    id: 1,
    title: "first note",
    content: "this is my first note",
  },
];

// LIST (ambil semua, tanpa content)
export const list = () => {
  return notes.map(({ id, title }) => ({
    id,
    title,
  }));
};

// GET BY ID
export const get = (id) => {
  const note = notes.find((note) => note.id === id);

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};

// CREATE
export const create = (title, content) => {
  const lastId = notes.length > 0 ? notes[notes.length - 1].id : 0;

  const newNote = {
    id: lastId + 1,
    title,
    content,
  };

  notes.push(newNote);
  return newNote;
};

// UPDATE
export const update = (id, title, content) => {
  const index = notes.findIndex((note) => note.id === id);

  if (index < 0) {
    throw new Error("Note not found for update");
  }

  notes[index] = {
    ...notes[index],
    title,
    content,
  };

  return notes[index];
};

// DELETE
export const deleteNote = (id) => {
  const exists = notes.some((note) => note.id === id);

  if (!exists) {
    throw new Error("Note not found for delete");
  }

  notes = notes.filter((note) => note.id !== id);
};