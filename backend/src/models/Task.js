import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
