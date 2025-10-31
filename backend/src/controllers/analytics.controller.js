import Task from "../models/Task.js";
import Idea from "../models/Idea.js";
import Note from "../models/Note.js";
import Message from "../models/Message.js";
import { ai, DEFAULT_MODEL } from "../config/gemini.js";

// ✅ Get Project Stats
export const getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasksCompleted = await Task.countDocuments({
      project: projectId,
      status: "Done",
    });
    const tasksPending = await Task.countDocuments({
      project: projectId,
      status: { $in: ["To Do", "In Progress"] },
    });
    const activeUsers = await Task.distinct("assignee", { project: projectId }).then(
      (users) => users.length
    );
    const totalProjects = 1; // Optional: Update if multi-project stats needed

    const ideas = await Idea.countDocuments({ project: projectId });
    const notes = await Note.countDocuments({ project: projectId });
    const messages = await Message.countDocuments({ project: projectId });

    res.json({ tasksCompleted, tasksPending, activeUsers, totalProjects, ideas, notes, messages });
  } catch (err) {
    console.error("Error fetching project stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Task Trends (last 7 days)
export const getTaskTrends = async (req, res) => {
  try {
    const { projectId } = req.params;

    const now = new Date();
    const trends = [];

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(now.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const completed = await Task.countDocuments({
        project: projectId,
        status: "Done",
        updatedAt: { $gte: dayStart, $lte: dayEnd },
      });

      const pending = await Task.countDocuments({
        project: projectId,
        status: { $in: ["To Do", "In Progress"] },
        updatedAt: { $gte: dayStart, $lte: dayEnd },
      });

      trends.push({
        day: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
        completed,
        pending,
      });
    }

    res.json(trends);
  } catch (err) {
    console.error("Error fetching task trends:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  AI Insights
export const getAIInsights = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId }).populate("assignee", "name email");
    const ideas = await Idea.find({ project: projectId });
    const notes = await Note.find({ project: projectId });

    const prompt = `
You are an AI project analyst. Analyze the following project data and generate insights:

Tasks:
${tasks.map((t) => `- ${t.title} [${t.status}] (assigned to ${t.assignee?.name || "Unassigned"})`).join("\n")}

Ideas:
${ideas.map((i) => `- ${i.title}`).join("\n")}

Notes:
${notes.map((n) => `- ${n.content}`).join("\n")}

Provide 3-5 actionable insights for improving productivity, identifying bottlenecks, and boosting project efficiency.
`;

    // Generate using Gemini AI
    const model = ai.getGenerativeModel({ model: DEFAULT_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.json({ insights: text.split("\n").filter((line) => line.trim() !== "") });
  } catch (err) {
    console.error("Error generating AI insights:", err);
    res.status(500).json({ message: "Failed to generate AI insights" });
  }
};
