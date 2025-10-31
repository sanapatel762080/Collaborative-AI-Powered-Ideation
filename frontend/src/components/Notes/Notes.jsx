

import React, { useState, useEffect } from "react";

export default function Notes({ projectId }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [message, setMessage] = useState(""); 

  // Fetch notes for this project
  useEffect(() => {
    if (!projectId) return;
    fetch(`http://localhost:5000/api/notes?projectId=${projectId}`)
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("Error fetching notes:", err));
  }, [projectId]);

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setNewContent(note.content);
    setMessage("");
  };

  // Save note
  const handleSave = () => {
    if (!selectedNote) return;

    const updatedNote = {
      ...selectedNote,
      content: newContent,
      version: selectedNote.version + 1,
      updatedAt: new Date().toISOString(),
    };

    setNotes(notes.map(n => n._id === selectedNote._id ? updatedNote : n));
    setSelectedNote(updatedNote);

    fetch(`http://localhost:5000/api/notes/${selectedNote._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent }),
    })
      .then(() => setMessage("✅ Note saved successfully!")) 
      .catch(err => console.error("Error saving note:", err));
  };

  // Create note
  const handleCreateNote = () => {
    if (!newTitle.trim()) return alert("Please enter a title for the note.");

    fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, title: newTitle, content: "" }),
    })
      .then(res => res.json())
      .then((createdNote) => {
        setNotes([createdNote, ...notes]);
        setSelectedNote(createdNote);
        setNewContent(createdNote.content);
        setNewTitle("");
        setMessage("✅ Note created successfully!");
      })
      .catch(err => console.error("Error creating note:", err));
  };

  // Delete note
  const handleDeleteNote = (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    fetch(`http://localhost:5000/api/notes/${noteId}`, { method: "DELETE" })
      .then(() => {
        setNotes(notes.filter(n => n._id !== noteId));
        if (selectedNote?._id === noteId) setSelectedNote(null);
        setMessage("✅ Note deleted successfully!");
      })
      .catch(err => console.error("Error deleting note:", err));
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Notes List */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">📝 Notes</h4>
              {message && <div className="alert alert-success">{message}</div>}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="New note title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleCreateNote}>
                  ➕ Add
                </button>
              </div>
              <ul className="list-group">
                {notes.map(note => (
                  <li
                    key={note._id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${selectedNote?._id === note._id ? "active" : ""}`}
                    onClick={() => handleSelectNote(note)}
                    style={{ cursor: "pointer" }}
                  >
                    <div>
                      <strong>{note.title}</strong><br />
                      <small>v{note.version} • {new Date(note.updatedAt).toLocaleString()}</small>
                    </div>
                    <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id); }}>
                      🗑
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Note Editor */}
        <div className="col-md-8">
          {selectedNote ? (
            <div className="card shadow-sm">
              <div className="card-body">
                <h4>
                  {selectedNote.title} <span className="badge bg-secondary">v{selectedNote.version}</span>
                </h4>
                <textarea
                  className="form-control mb-3"
                  rows="10"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
                <button className="btn btn-success me-2" onClick={handleSave}>
                  💾 Save
                </button>
              </div>
            </div>
          ) : (
            <div className="alert alert-info">Select a note to view and edit.</div>
          )}
        </div>
      </div>
    </div>
  );
}

