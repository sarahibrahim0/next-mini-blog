import { z } from 'zod';

export const createArticleSchema = z.object({
  title:   z.string({
      error: (iss) =>
        iss.input === undefined
          ? "Title is required"
          : "Title must be a string",
    })
    .min(2, { message: "Title should be at least 2 characters long" })
    .max(200, { message: "Title should be less than 200 characters" }),

  description: z
     .string({
      error: (iss) =>
        iss.input === undefined
          ? "Description is required"
          : "Description must be a string",
    })
    .min(10, { message: "Description should be at least 10 characters long" }),
});
// Register Schema
export const registerSchema = z.object({
    username: z.string().min(2).max(100), //.optional(),
    email: z.email().min(3).max(200),
    password: z.string().min(6),
});

// Login Schema
export const loginSchema = z.object({
    email: z.email().min(3).max(200),
    password: z.string().min(6),
});

// Create Comment Schema
export const createCommentSchema = z.object({
    text: z.string().min(2).max(500),
    articleId: z.number(),
});

// Update User Profile Schema
export const updateUserSchema = z.object({
    username: z.string().min(2).max(100).optional(),
    email: z.email().min(3).max(200).optional(),
    password: z.string().min(6).optional(),
});