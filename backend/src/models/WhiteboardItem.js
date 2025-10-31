import mongoose from "mongoose";

const whiteboardItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["note", "rectangle", "circle"], required: true },
    content: { type: String }, // for notes
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    size: {
      width: { type: Number },
      height: { type: Number },
      radius: { type: Number }, // for circle
    },
    color: { type: String, default: "#fffa65" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("WhiteboardItem", whiteboardItemSchema);
