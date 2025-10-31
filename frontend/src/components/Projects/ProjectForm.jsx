import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function ProjectForm() {
  const { id } = useParams(); // project ID for edit
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext); // get logged-in user

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
    team: "", // comma separated user IDs
  });

  const [loading, setLoading] = useState(false);

  // Fetch project if editing
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setFormData({
          name: res.data.name,
          description: res.data.description || "",
          status: res.data.status || "Active",
          team: res.data.team ? res.data.team.map((u) => u._id).join(",") : "",
        });
      } catch (err) {
        console.error("Error fetching project:", err);
        alert("Failed to fetch project data");
      }
    };

    fetchProject();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return alert("Project name is required");
    if (!currentUser || !currentUser._id) return alert("User not logged in");

    setLoading(true);

    // Prepare payload
    const payload = {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      owner: currentUser._id,
      team: formData.team
        ? formData.team.split(",").map((id) => id.trim())
        : [],
    };

    try {
      if (id) {
        // Edit mode
        await axios.put(`http://localhost:5000/api/projects/${id}`, payload);
        alert("Project updated successfully!");
      } else {
        // Create mode
        await axios.post("http://localhost:5000/api/projects", payload);
        alert("Project created successfully!");
      }

      navigate("/projects"); // go back to project list
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Failed to save project. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>{id ? "Edit Project" : "New Project"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Active</option>
            <option>Completed</option>
            <option>Archived</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Team (comma-separated user IDs)</Form.Label>
          <Form.Control
            type="text"
            name="team"
            value={formData.team}
            onChange={handleChange}
            placeholder="e.g. 64f0e5a1abcd1234, 64f0e5a1abcd5678"
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : id ? "Update Project" : "Create Project"}
        </Button>
      </Form>
    </Container>
  );
}
