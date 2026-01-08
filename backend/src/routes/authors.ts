import { Router, Request, Response } from "express";
import { AuthorModel } from "../models/authorModel";

const router = Router();

// GET /api/authors - List all authors
router.get("/", (req: Request, res: Response) => {
  try {
    const authors = AuthorModel.getAllAuthors();

    res.json({
      success: true,
      data: authors,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/authors/:id - Get single author
router.get("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const author = AuthorModel.getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        error: "Author not found",
      });
    }

    res.json({
      success: true,
      data: author,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
