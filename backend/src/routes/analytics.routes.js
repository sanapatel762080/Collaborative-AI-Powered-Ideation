import express from "express";
import {
  getProjectStats,
  getTaskTrends,
  getAIInsights,
} from "../controllers/analytics.controller.js";

const router = express.Router();


router.get("/project/:projectId", getProjectStats);

router.get("/project/:projectId/trends", getTaskTrends);

router.get("/project/:projectId/ai", getAIInsights);

export default router;
