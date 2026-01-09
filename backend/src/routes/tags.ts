import { Router, Request, Response } from "express";
import { TagModel } from "../models/tagModel";

const router = Router();

// GET /api/tags - List all tags
router.get("/", (req: Request, res: Response) => {
  try {
    const tags = TagModel.getAllTags();

    res.json({
      success: true,
      data: tags,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
