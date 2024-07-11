const { Router } = require("express");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { Notes } = require("../models");

const router = Router();

// GET all notes for the logged-in user based on userId
router.get("/:id", validateToken, async (req, res) => {
  const userId = req.params.id; // Extracted from the route parameter
  try {
    const userNotes = await Notes.findAll({ where: { userId } });
    res.json(userNotes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// GET a specific note by its ID
router.get("/note/:noteId", validateToken, async (req, res) => {
  const noteId = req.params.noteId;
  try {
    const note = await Notes.findOne({
      where: { id: noteId, userId: req.user.id },
    });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// POST a new note for the logged-in user
router.post("/", async (req, res) => {
  // Removed validateToken
  const { userId, title, content } = req.body; // Assuming userId is part of the request body

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const newNote = await Notes.create({ title, content, userId });
    res.json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

//Update Note Routes
router.put("/note/:noteId", validateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content } = req.body;

  try {
    const note = await Notes.findOne({
      where: { id: noteId, userId: req.user.id },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.title = title;
    note.content = content;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

//Delete Note Route
router.delete("/note/:noteId", validateToken, async (req, res) => {
  const noteId = req.params.noteId;

  try {
    const result = await Notes.destroy({
      where: { id: noteId, userId: req.user.id },
    });

    if (result === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
