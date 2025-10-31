import express from "express";
import { getWhiteboardItems, createWhiteboardItem, updateWhiteboardItem } from "../controllers/whiteboard.controller.js";

const router = express.Router();

router.get("/:projectId", getWhiteboardItems);
router.post("/", createWhiteboardItem);
router.put("/:id", updateWhiteboardItem);

export default router;
