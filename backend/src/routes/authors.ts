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

// POST /api/authors - Create new author
router.post("/", (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      email,
      company,
      job_title,
      bio,
      follower_count,
      verified
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        error: "first_name, last_name, and email are required",
      });
    }

    // Check if author with email already exists
    const existingAuthor = AuthorModel.getAuthorByEmail(email);
    if (existingAuthor) {
      return res.status(400).json({
        success: false,
        error: "Author with this email already exists",
      });
    }

    const authorId = AuthorModel.createAuthor({
      first_name,
      last_name,
      email,
      company: company || "",
      job_title: job_title || "",
      bio: bio || "",
      follower_count: follower_count || 0,
      verified: verified || false,
    });

    const newAuthor = AuthorModel.getAuthorById(authorId);

    res.status(201).json({
      success: true,
      data: newAuthor,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/authors/:id - Update author
router.put("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // Check if author exists
    const existingAuthor = AuthorModel.getAuthorById(id);
    if (!existingAuthor) {
      return res.status(404).json({
        success: false,
        error: "Author not found",
      });
    }

    const {
      first_name,
      last_name,
      email,
      company,
      job_title,
      bio,
      follower_count,
      verified,
    } = req.body;

    // If email is being updated, check it doesn't conflict with another author
    if (email && email !== existingAuthor.email) {
      const authorWithEmail = AuthorModel.getAuthorByEmail(email);
      if (authorWithEmail && authorWithEmail.id !== id) {
        return res.status(400).json({
          success: false,
          error: "Another author with this email already exists",
        });
      }
    }

    const updateData: any = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email !== undefined) updateData.email = email;
    if (company !== undefined) updateData.company = company;
    if (job_title !== undefined) updateData.job_title = job_title;
    if (bio !== undefined) updateData.bio = bio;
    if (follower_count !== undefined) updateData.follower_count = follower_count;
    if (verified !== undefined) updateData.verified = verified;

    const updated = AuthorModel.updateAuthor(id, updateData);

    if (!updated) {
      return res.status(400).json({
        success: false,
        error: "No valid fields to update",
      });
    }

    const updatedAuthor = AuthorModel.getAuthorById(id);

    res.json({
      success: true,
      data: updatedAuthor,
      message: "Author updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
