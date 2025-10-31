import Message from '../models/Message.js';

// Get previous messages for a project
export const getMessages = async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) return res.status(400).json({ error: "Project ID is required" });

  try {
    const messages = await Message.find({ projectId }).sort({ createdAt: 1 }).lean();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
