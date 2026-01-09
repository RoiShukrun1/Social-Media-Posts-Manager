import { Router, Request, Response } from "express";
import { TagModel } from "../models/tagModel";
import { getErrorMessage } from "../utils/errorHandler";

const router = Router();

// GET /api/tags - List all tags
router.get("/", (req: Request, res: Response) => {
  try {
    const tags = TagModel.getAllTags();

    res.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
