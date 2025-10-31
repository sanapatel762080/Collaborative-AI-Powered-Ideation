import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
    <div className="d-flex"style={{ minHeight: "100vh" }}>
      
      <div className="bg-dark text-white p-3" style={{ width: "220px", minHeight: "100vh" }}>
        <h4 className="mb-4">Collab-AI</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/ai-ideation">🤖 AI Ideation</Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/chat">💬 Chat & Commenting</Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/notes">📝 Notes & Version Control</Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/analytics">📊 Analytics Dashboard</Link>
          </li>
        </ul>
      </div>

      
      <div className="flex-grow-1">
        
        <nav className="navbar navbar-light bg-light shadow-sm px-3">
          <span className="navbar-brand">🚀 Collaborative AI Platform</span>
        </nav>

        <div className="container-fluid p-4">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
}