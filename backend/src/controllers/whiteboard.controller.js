import WhiteboardItem from "../models/WhiteboardItem.js";

// Get all items for a project
export const getWhiteboardItems = async (req, res) => {
  try {
    const { projectId } = req.params;
    const items = await WhiteboardItem.find({ project: projectId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new item
export const createWhiteboardItem = async (req, res) => {
  try {
    const item = await WhiteboardItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update item position / content
export const updateWhiteboardItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await WhiteboardItem.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

