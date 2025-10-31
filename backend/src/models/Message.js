import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  user: { type: String, required: true },
  emoji: { type: String, required: true },
}, { _id: false });

const messageSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: String, required: true }, // e.g., "10:30 AM"
    reactions: { type: [reactionSchema], default: [] },
    seenBy: { type: [String], default: [] }, // users who have seen the message
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
