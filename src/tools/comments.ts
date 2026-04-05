import { z } from "zod";

export const listCommentsSchema = z.object({
  taskId: z.coerce.number().int().positive(),
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().max(100).optional(),
});

export const createCommentSchema = z.object({
  taskId: z.coerce.number().int().positive(),
  comment: z.string().min(1),
});

export const updateCommentSchema = z.object({
  taskId: z.coerce.number().int().positive(),
  commentId: z.coerce.number().int().positive(),
  comment: z.string().min(1),
});

export const deleteCommentSchema = z.object({
  taskId: z.coerce.number().int().positive(),
  commentId: z.coerce.number().int().positive(),
});

export type ListCommentsInput = z.infer<typeof listCommentsSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;
