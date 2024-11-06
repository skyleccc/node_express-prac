const express = require("express");
const router = express.Router();

const notes = require("../controllers/notesController");
const validateToken = require("../middleware/auth");

// Get all notes
router.get("/", validateToken, notes.getAllNotesController);

// Get a single note by ID
router.get("/:id", validateToken, notes.getNoteController);

// Create a new note
router.post("/", validateToken, notes.createNoteController);

// Update a note by ID
router.put("/:id", validateToken, notes.updateNoteController);

// Delete a note by ID
router.delete("/:id", validateToken, notes.deleteNoteController);

module.exports = router;