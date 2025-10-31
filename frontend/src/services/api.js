
/*
export const generateIdeas = async (prompt, projectId) => {
  try {
    const res = await fetch("http://localhost:5000/api/ideas/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, projectId }),
    });

    if (!res.ok) throw new Error("Failed to generate ideas");

    return res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

export const saveIdea = async (ideaObj) => {
  try {
    const res = await fetch("http://localhost:5000/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ideaObj),
    });

    if (!res.ok) throw new Error("Failed to save idea");

    return res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

export default { generateIdeas, saveIdea };
*/

// src/services/api.js

// Existing Idea APIs
export const generateIdeas = async (prompt, projectId) => {
  try {
    const res = await fetch("http://localhost:5000/api/ideas/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, projectId }),
    });

    if (!res.ok) throw new Error("Failed to generate ideas");
    return res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

export const saveIdea = async (ideaObj) => {
  try {
    const res = await fetch("http://localhost:5000/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ideaObj),
    });

    if (!res.ok) throw new Error("Failed to save idea");
    return res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

// ✅ New Auth APIs
export const signup = async (userObj) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userObj),
    });

    if (!res.ok) throw new Error("Signup failed");
    return res.json();
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
};

export const login = async (userObj) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userObj),
    });

    if (!res.ok) throw new Error("Login failed");
    return res.json();
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};


// ✅ Project APIs
export const createProject = async (projectObj) => {
  try {
    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectObj),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

export const getProjects = async (search = "") => {
  try {
    const res = await fetch(`http://localhost:5000/api/projects?search=${search}`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

export const getProjectById = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/projects/${id}`);
    if (!res.ok) throw new Error("Failed to fetch project");
    return res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

// ✅ Tasks APIs
export const createTask = async (taskObj) => {
  try {
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskObj),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

export const getTasksByProject = async (projectId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/tasks/${projectId}`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

export const updateTask = async (taskId, data) => {
  try {
    const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

// Add to default export
export default {
  generateIdeas,
  saveIdea,
  signup,
  login,
  createProject,
  getProjects,
  getProjectById,
  createTask,
  getTasksByProject,
  updateTask,
};





