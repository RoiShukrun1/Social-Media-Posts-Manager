import { Router, Request, Response } from "express";
import { PostModel } from "../models/postModel";
import { z } from "zod";

const router = Router();

// GET /api/posts - List posts with filtering, sorting, and pagination
router.get("/", (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const sortField = (req.query.sortBy as string) || "date";
    const sortOrder =
      (req.query.order as string)?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const filters: any = {};

    if (req.query.category) filters.category = req.query.category;
    if (req.query.authorId)
      filters.authorId = parseInt(req.query.authorId as string);
    if (req.query.tag) filters.tagName = req.query.tag;
    if (req.query.search) filters.search = req.query.search;
    if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom;
    if (req.query.dateTo) filters.dateTo = req.query.dateTo;
    if (req.query.minLikes)
      filters.minLikes = parseInt(req.query.minLikes as string);
    if (req.query.minEngagement)
      filters.minEngagement = parseFloat(req.query.minEngagement as string);

    const sort: any = {
      field: [
        "date",
        "likes",
        "comments",
        "shares",
        "engagement_rate",
      ].includes(sortField)
        ? sortField
        : "date",
      order: sortOrder,
    };

    const result = PostModel.getAllPosts(filters, sort, { page, limit });

    res.json({
      success: true,
      data: result.posts,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/posts/:id - Get single post
router.get("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const post = PostModel.getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/posts - Create new post
const createPostSchema = z.object({
  author_id: z.number(),
  text: z.string().min(1),
  date: z.string(),
  likes: z.number().default(0),
  comments: z.number().default(0),
  shares: z.number().default(0),
  image_svg: z.string().nullable().optional(),
  category: z.string(),
  location: z.string().nullable().optional(),
  engagement_rate: z.number().default(0),
  tags: z.array(z.string()).default([]),
});

// PUT /api/posts/:id - Update post
const updatePostSchema = z.object({
  author_id: z.number().optional(),
  text: z.string().min(1).optional(),
  date: z.string().optional(),
  likes: z.number().optional(),
  comments: z.number().optional(),
  shares: z.number().optional(),
  image_svg: z.string().nullable().optional(),
  category: z.string().optional(),
  location: z.string().nullable().optional(),
  engagement_rate: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

router.post("/", (req: Request, res: Response) => {
  try {
    const validatedData = createPostSchema.parse(req.body);
    const { tags, ...postData } = validatedData;

    // Convert undefined to null for optional fields
    const cleanedPostData = {
      ...postData,
      image_svg: postData.image_svg ?? null,
      location: postData.location ?? null,
    };

    const postId = PostModel.createPost(cleanedPostData, tags);
    const newPost = PostModel.getPostById(postId);

    res.status(201).json({
      success: true,
      data: newPost,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/posts/:id - Update post
router.put("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // Check if post exists
    const existingPost = PostModel.getPostById(id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    const validatedData = updatePostSchema.parse(req.body);
    const { tags, ...postData } = validatedData;

    // Convert undefined to null for optional fields
    const cleanedPostData: any = { ...postData };
    if (
      "image_svg" in cleanedPostData &&
      cleanedPostData.image_svg === undefined
    ) {
      cleanedPostData.image_svg = null;
    }
    if (
      "location" in cleanedPostData &&
      cleanedPostData.location === undefined
    ) {
      cleanedPostData.location = null;
    }

    const updated = PostModel.updatePost(id, cleanedPostData, tags);

    if (!updated && tags === undefined) {
      return res.status(400).json({
        success: false,
        error: "No valid fields to update",
      });
    }

    const updatedPost = PostModel.getPostById(id);

    res.json({
      success: true,
      data: updatedPost,
      message: "Post updated successfully",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = PostModel.deletePost(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
