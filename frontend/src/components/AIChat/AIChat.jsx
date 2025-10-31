
import React, { useState } from "react";
import { generateIdeas, saveIdea } from "../../services/api";
import IdeaList from "./IdeaList";

export default function AIChat({ projectId }) {  
  const [prompt, setPrompt] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateIdeas = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const data = await generateIdeas(prompt, projectId); 
      setIdeas(data.ideas || []);
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to generate ideas.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleSaveIdea = async (idea) => {
    try {
      await saveIdea({ projectId, prompt: prompt || "AI Generated", suggestion: idea }); 
      alert("✅ Idea saved successfully!");
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to save idea.");
    }
  };

  const handleDeleteIdea = (index) => setIdeas(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">💡 AI Ideation Module</h2>

          <form onSubmit={handleGenerateIdeas} className="d-flex mb-3">
            <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter your idea prompt..." className="form-control me-2" />
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? "Generating..." : "Generate"}</button>
          </form>

          {loading && (
            <div className="text-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Thinking of creative ideas...</p>
            </div>
          )}

          {!loading && ideas.length > 0 && <IdeaList ideas={ideas} onDelete={handleDeleteIdea} onSave={handleSaveIdea} />}
          {!loading && ideas.length === 0 && <p className="text-muted text-center mt-3">No ideas yet. 🤔 Try asking AI for some inspiration!</p>}
        </div>
      </div>
    </div>
  );
}

