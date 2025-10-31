import Task from "../models/Task.js";

// Get tasks for a project
export const getTasks = async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) return res.status(400).json({ message: "Project ID missing" });

  try {
    const tasks = await Task.find({ project: projectId }).populate("assignee", "name email");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task
export const addTask = async (req, res) => {
  try {
    const { title, description, status, project, assignee, priority, dueDate } = req.body;
    const newTask = await Task.create({ title, description, status, project, assignee, priority, dueDate });
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, assignee, priority, dueDate } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, assignee, priority, dueDate },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
