import React, { useState, useContext } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ initialize

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const user = await login(email, password); // login via context
      setSuccess("Login successful!");

      // ✅ redirect after login
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/projects"); // normal user goes to Projects page
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "25rem" }} className="shadow">
        <Card.Body>
          <h3 className="text-center mb-3">Login</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
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

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>

          {/* ✅ Added signup redirect */}
          <div className="text-center mt-3">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-decoration-none">
              Signup
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
