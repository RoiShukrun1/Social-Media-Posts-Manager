/**
 * stats.ts
 *
 * Statistics routes and request handlers.
 * Handles HTTP endpoint for retrieving dashboard statistics.
 * Provides aggregated metrics including total posts, likes, comments, and average engagement rate.
 */

import { Router, Request, Response } from "express";
import { StatsModel } from "../models/statsModel";
import { getErrorMessage } from "../utils/errorHandler";
import { HTTP_STATUS } from "../constants";

const router = Router();

// GET /api/stats - Get dashboard statistics
router.get("/", (req: Request, res: Response) => {
  try {
    const stats = StatsModel.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
