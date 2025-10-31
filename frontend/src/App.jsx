import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import AppNavbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";

import ProjectsList from "./components/Projects/ProjectList";
import ProjectForm from "./components/Projects/ProjectForm";
import ProjectDashboard from "./components/Projects/ProjectDashboard";
import TasksPage from "./components/Tasks/TasksPage";
import WhiteboardWrapper from "./components/Whiteboard/WhiteboardWrapper";
import ChatRoom from "./components/Chat/ChatRoom";

// PrivateRoute wrapper
function PrivateRoute({ children, roles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

// InnerApp
function InnerApp() {
  const { user } = useContext(AuthContext);

  // fallback dummy user for testing
  const currentUser = user || {
    name: "Sana Patel",
    avatar: "https://i.pravatar.cc/40?img=3",
    role: "USER",
  };

  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <AdminPanel />
            </PrivateRoute>
          }
        />

        {/* Project routes */}
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
<Route path="/projects/edit/:id" element={<ProjectForm />} />
        <Route path="/projects/:id" element={<ProjectDashboard />} />

        {/* Tasks & Whiteboard */}
        <Route path="/projects/:id/tasks" element={<TasksPage />} />
        <Route path="/projects/:id/whiteboard" element={<WhiteboardWrapper />} />

        {/* Chat */}
        <Route
          path="/projects/:projectId/chat"
          element={
            <ChatRoom user={currentUser.name} avatar={currentUser.avatar} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// Export with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
