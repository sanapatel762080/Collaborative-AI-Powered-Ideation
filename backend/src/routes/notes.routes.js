
import express from "express";
import Note from "../models/Note.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    note.content = content;
    note.version += 1;
    note.updatedAt = new Date();
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/", async (req, res) => {
  try {
    const { projectId, title, content } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ error: "projectId and title are required" });
    }

    const newNote = await Note.create({
      projectId,       
      title,
      content,
      version: 1,
      updatedAt: new Date(),
    });

    res.status(201).json(newNote);
  } catch (err) {
    console.error("Create Note Error:", err.message);
    res.status(500).json({ error: "Failed to create note" });
  }
});



export default router;
