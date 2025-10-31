import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema(
    {
projectId: { type: String, required: true }, 
prompt: { type: String, required: true },
suggestion: { type: String, required: true },
tags: [String],
createdBy: { type: String }, 
},
{ timestamps: true }
);


export default mongoose.model('Idea', IdeaSchema);


