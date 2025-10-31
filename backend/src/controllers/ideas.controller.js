import { ai, DEFAULT_MODEL } from "../config/gemini.js";
import Idea from "../models/Idea.js";

export async function generateIdeas(req, res) {
  try {
    const { prompt = "", projectId } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const system = `You are an expert product strategist. Return 6 concise, actionable ideas as a numbered list. Each under 18 words.`;

    console.log("Calling Gemini API with prompt:", prompt);

    const { text, raw } = await ai.generateText({
      model: DEFAULT_MODEL,
      input: `${system}\nTopic: ${prompt}`,
    });

    console.log("Gemini raw response object:", raw);
    console.log("Parsed AI text:", text);

    const suggestions = text
      .split(/\n+/)
      .map((l) => l.replace(/^\d+\.|^-\s*/, "").trim())
      .filter(Boolean);

    res.json({ ideas: suggestions, raw: text, projectId });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to generate ideas" });
  }
}

export async function saveIdea(req, res) {
  try {
    const { projectId, prompt, suggestion, tags = [], createdBy } = req.body;
    if (!projectId || !prompt || !suggestion)
      return res.status(400).json({ error: "projectId, prompt, suggestion required" });

    const idea = await Idea.create({ projectId, prompt, suggestion, tags, createdBy });
    res.status(201).json(idea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save idea" });
  }
}

export async function listIdeas(req, res) {
  try {
    const { projectId } = req.params;
    const ideas = await Idea.find({ projectId }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list ideas" });
  }
}
