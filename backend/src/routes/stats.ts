import { Router, Request, Response } from "express";
import { StatsModel } from "../models/statsModel";
import { getErrorMessage } from "../utils/errorHandler";

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
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
