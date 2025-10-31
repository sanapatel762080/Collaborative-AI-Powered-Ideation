import React from "react";

export default function IdeaList({ ideas, onDelete, onSave }) {
  return (
    <div className="mt-3">
      {ideas.length === 0 ? (
        <p>No ideas generated yet.</p>
      ) : (
        <div className="row">
          {ideas.map((idea, index) => (
            <div key={index} className="col-md-6 mb-3">
              <div className="card border-info shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <span>{idea}</span>
                  <div>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => onSave && onSave(idea)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete && onDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
