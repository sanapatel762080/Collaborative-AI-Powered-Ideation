
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
      projectId: { type: String, required: true }, 

    title: { type: String, required: true },
    content: { type: String, default: "" },
    version: { type: Number, default: 1 },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
