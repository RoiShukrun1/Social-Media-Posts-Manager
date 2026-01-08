import { Router, Request, Response } from 'express';
import { StatsModel } from '../models/statsModel';

const router = Router();

// GET /api/stats - Get dashboard statistics
router.get('/', (req: Request, res: Response) => {
  try {
    const stats = StatsModel.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

