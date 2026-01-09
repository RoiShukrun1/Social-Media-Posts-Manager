/**
 * tags.ts
 *
 * Tag routes and request handlers.
 * Handles HTTP endpoint for retrieving all available tags.
 * Tags are automatically created and managed through post operations.
 */

import { Router, Request, Response } from "express";
import { TagModel } from "../models/tagModel";
import { getErrorMessage } from "../utils/errorHandler";
import { HTTP_STATUS } from "../constants";

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
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
