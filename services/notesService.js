const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createNote = async (title, description, userId) => {
  const note = await prisma.note.create({
    data: {
      title: title,
      description: description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return note;
};

const getAllNotes = async (id) => {
  const notes = await prisma.note.findMany({
    where: {
      userId: id,
    },
  });
  return notes;
};

const getNote = async (id) => {
  const note = await findNote(id);
  return note;
};

const updateNote = async (id, title, description) => {
  const note = await findNote(id);

  if (!note) return null;

  const updatedNote = await prisma.note.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      description: description,
    },
  });

  return updatedNote;
};

const deleteNote = async (id) => {
  const note = await findNote(id);

  if (!note) return null;
  const deletedNote = await prisma.note.delete({
    where: {
      id: id,
    },
  });

  return deletedNote;
};

const findNote = async (id) => {
  const note = await prisma.note.findUnique({
    where: {
      id: id,
    },
  });
  return note;
};

module.exports = {
  createNote,
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
};
