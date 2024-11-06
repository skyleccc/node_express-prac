const notes = require("../services/notesService");

const createNoteController = async (req, res) => {
    const { title, description } = req.body;
    const user = req.user;
    if (!description) return res.status(400).json({ error: "Description is required" });

    const newNote = await notes.createNote(title, description, user.id);

    res.status(201).json(newNote);
};

const getAllNotesController = async (req, res) => {
    const user = req.user;
    const notesList = await notes.getAllNotes(user.id);

    res.json(notesList);
};

const getNoteController = async (req, res) => {
    const note = await notes.getNote(parseInt(req.params.id, 10));

    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ error: "Note not found" });
    }
};

const updateNoteController = async (req, res) => {
    const {title, description} = req.body;
    if (!description) return res.status(400).json({ error: "Description is required" });
    const newTitle = (title) ? title : "Untitled";

    const note = await notes.updateNote(
        parseInt(req.params.id, 10),
        newTitle,
        description
    );

    if(!note) return res.status(404).json({ error: "Note not found"});

    res.json(note);
};

const deleteNoteController = async (req, res) => {
    const note = await notes.deleteNote(parseInt(req.params.id, 10));

    if(!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
};

module.exports = {
    createNoteController,
    getAllNotesController,
    getNoteController,
    updateNoteController,
    deleteNoteController,
}