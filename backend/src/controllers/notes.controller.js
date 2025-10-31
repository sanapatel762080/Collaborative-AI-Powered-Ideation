import Note from '../models/Note.js';

export async function createNote(req, res, next) {
try {
const { projectId, title, content, editedBy } = req.body;
if (!projectId || !title || !content) return res.status(400).json({ error: 'projectId, title, content required' });


const note = await Note.create({
projectId,
title,
versions: [{ content, editedBy }]
});
res.status(201).json(note);
} catch (err) { next(err); }
}

export async function getNote(req, res, next) {
try {
const note = await Note.findById(req.params.id);
if (!note) return res.status(404).json({ error: 'Note not found' });
res.json(note);
} catch (err) { next(err); }
}

export async function addVersion(req, res, next) {
try {
const { content, editedBy } = req.body;
if (!content) return res.status(400).json({ error: 'content required' });


const note = await Note.findById(req.params.id);
if (!note) return res.status(404).json({ error: 'Note not found' });


note.versions.push({ content, editedBy });
await note.save();
res.json(note);
} catch (err) { next(err); }
}

export async function listNotes(req, res, next) {
try {
const { projectId } = req.params;
const notes = await Note.find({ projectId }).sort({ updatedAt: -1 });
res.json(notes);
} catch (err) { next(err); }
}
