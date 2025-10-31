
/*
import monggose from 'mongoose';

const ProjectSchema = new monggose.Schema(
    {

        name: { type: String, required: true },
        description: String,
    },
    { timestamps: true }

);

export default monggose.model('Project', ProjectSchema);

*/

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
