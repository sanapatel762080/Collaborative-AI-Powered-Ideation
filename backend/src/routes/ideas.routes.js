

import { Router } from "express";
import { generateIdeas, saveIdea, listIdeas } from "../controllers/ideas.controller.js";
import express from "express";
import Idea from "../models/Idea.js";

const router = express.Router();

router.post("/generate", generateIdeas); 
router.post("/", saveIdea);              
router.get("/:projectId", listIdeas);



router.post("/", async (req, res) => {
  try {
    const { projectId, title, description } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ error: "projectId and title are required" });
    }

    const newIdea = await Idea.create({
      projectId,    
      title,
      description
    });

    res.status(201).json(newIdea);
  } catch (err) {
    console.error("Create Idea Error:", err.message);
    res.status(500).json({ error: "Failed to create idea" });
  }
});



export default router;




