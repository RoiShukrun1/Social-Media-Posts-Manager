/**
 * authors.ts
 *
 * Author routes and request handlers.
 * Handles HTTP endpoints for author creation and updates with Zod validation.
 * Ensures email uniqueness and provides detailed validation error messages.
 */

import { Router, Request, Response } from "express";
import { AuthorModel } from "../models/authorModel";
import {
  getErrorMessage,
  hasErrorName,
  hasErrorDetails,
} from "../utils/errorHandler";
import { HTTP_STATUS } from "../constants";
import { z } from "zod";

const router = Router();

// Validation schemas
const createAuthorSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  company: z.string().default(""),
  job_title: z.string().default(""),
  bio: z.string().default(""),
  follower_count: z.number().int().min(0).default(0),
  verified: z.boolean().default(false),
});

const updateAuthorSchema = z.object({
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  company: z.string().optional(),
  job_title: z.string().optional(),
  bio: z.string().optional(),
  follower_count: z.number().int().min(0).optional(),
  verified: z.boolean().optional(),
});

// POST /api/authors - Create new author
router.post("/", (req: Request, res: Response) => {
  try {
    // Validate request body with Zod
    const validatedData = createAuthorSchema.parse(req.body);

    // Check if author with email already exists
    const existingAuthor = AuthorModel.getAuthorByEmail(validatedData.email);
    if (existingAuthor) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Author with this email already exists",
      });
    }

    const authorId = AuthorModel.createAuthor(validatedData);
    const newAuthor = AuthorModel.getAuthorById(authorId);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: newAuthor,
    });
  } catch (error) {
    if (hasErrorName(error) && error.name === "ZodError") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Validation error",
        details: hasErrorDetails(error) ? error.errors : undefined,
      });
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: getErrorMessage(error),
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
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Author not found",
      });
    }

    // Validate request body with Zod
    const validatedData = updateAuthorSchema.parse(req.body);

    // If email is being updated, check it doesn't conflict with another author
    if (validatedData.email && validatedData.email !== existingAuthor.email) {
      const authorWithEmail = AuthorModel.getAuthorByEmail(validatedData.email);
      if (authorWithEmail && authorWithEmail.id !== id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: "Another author with this email already exists",
        });
      }
    }

    const updated = AuthorModel.updateAuthor(id, validatedData);

    if (!updated) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
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
  } catch (error) {
    if (hasErrorName(error) && error.name === "ZodError") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Validation error",
        details: hasErrorDetails(error) ? error.errors : undefined,
      });
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
