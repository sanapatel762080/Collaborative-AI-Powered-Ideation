import express from "express";
import {
  getProjectStats,
  getTaskTrends,
  getAIInsights,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// GET /api/analytics/project/:projectId  → Project stats
router.get("/project/:projectId", getProjectStats);

// GET /api/analytics/project/:projectId/trends  → Task trends (last 7 days)
router.get("/project/:projectId/trends", getTaskTrends);

// GET /api/analytics/project/:projectId/ai  → AI insights
router.get("/project/:projectId/ai", getAIInsights);

export default router;
