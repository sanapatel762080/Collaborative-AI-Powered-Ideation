import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
      setFilteredProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("Failed to load projects");
    }
  };

  // Search & filter
  useEffect(() => {
    let filtered = projects;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredProjects(filtered);
  }, [searchQuery, statusFilter, projects]);

  // Delete project
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Projects</h2>
        <Link to="/projects/new">
          <Button variant="primary">+ New Project</Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by project name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Project List */}
      <Row>
  {filteredProjects.length > 0 ? (
    filteredProjects.map((project) => (
      <Col md={4} key={project._id} className="mb-3">
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title>{project.name}</Card.Title>
            <Card.Text>{project.description}</Card.Text>
            <p>
              <strong>Status:</strong> {project.status}
            </p>
            <div className="d-flex justify-content-between mt-2">
              <Link to={`/projects/${project._id}`}>
                <Button variant="secondary">Open</Button>
              </Link>
              <Link
                to={`/projects/${project._id}/chat`}
                className="btn btn-outline-primary"
              >
                💬 Chat
              </Link>
              <Link
                to={`/projects/edit/${project._id}`} // corrected here
                className="btn btn-outline-warning"
              >
                ✏️ Edit
              </Link>
              <Button
                variant="outline-danger"
                onClick={() => handleDelete(project._id)}
              >
                🗑️ Delete
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))
  ) : (
    <p>No projects found.</p>
  )}
</Row>

    </div>
  );
}

