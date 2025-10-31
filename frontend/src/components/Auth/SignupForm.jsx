import React, { useState, useContext } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link

export default function SignupForm() {
  const { signup, login } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ initialize

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // Create new user
      const user = await signup(name, email, password);

      setSuccess("Signup successful! Logging you in...");

      // Automatically log in the user after signup
      const loggedInUser = await login(email, password);

      // Redirect based on role
      if (loggedInUser.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/projects");
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "25rem" }} className="shadow">
        <Card.Body>
          <h3 className="text-center mb-3">Signup</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Signup
            </Button>
          </Form>

          {/* ✅ Added login redirect */}
          <div className="text-center mt-3">
            Already registered?{" "}
            <Link to="/login" className="text-decoration-none">
              Login
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

