
import Project from "../models/Project.js";

// Create new project
export const createProject = async (req, res) => {
  try {
    const { name, description, owner, team, status } = req.body;

    if (!name || !owner) {
      return res
        .status(400)
        .json({ message: "Project name and owner are required" });
    }

    const project = await Project.create({
      name,
      description,
      owner,
      team: team || [],
      status: status || "Active",
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err);
    res
      .status(500)
      .json({ message: "Failed to save project", error: err.message });
  }
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }
    const projects = await Project.find(query)
      .populate("owner", "name email")
      .populate("team", "name email");
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects", error: err.message });
  }
};

// Get single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("team", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch project", error: err.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { name, description, status, team } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        status,
        team: team || [],
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) return res.status(404).json({ message: "Project not found" });

    res.json(updatedProject);
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ message: "Failed to update project", error: err.message });
  }
};


// Delete project
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject)
      return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project", error: err.message });
  }
};
