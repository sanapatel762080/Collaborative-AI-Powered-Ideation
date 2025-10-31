import mongoose from "mongoose";
import Idea from "./src/models/Idea.js";
import Note from "./src/models/Note.js";
import Message from "./src/models/Message.js";

const uri="mongodb+srv://sanapatel152003:aVMspgFy5en86kGD@cluster0.9x0kijg.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0"


await mongoose.connect(uri);
console.log("Connected to MongoDB Atlas");

const projectId = "123";

await Idea.updateMany({}, { $set: { projectId } });
await Note.updateMany({}, { $set: { projectId } });
await Message.updateMany({}, { $set: { projectId } });

console.log("All existing documents updated with projectId:", projectId);

await Note.create({ projectId, title: "Test Note", content: "This is a test note" });
await Idea.create({ projectId, title: "Test Idea", description: "This is a test idea" });
await Message.create({ projectId, sender: "User1", text: "Hello project 123!" });

console.log("Dummy data added for testing AnalyticsDashboard");

mongoose.disconnect();
console.log("Done!");
