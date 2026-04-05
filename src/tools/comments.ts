import { z } from "zod";

const idField = () =>
  z.union([
    z.number().int().positive(),
    z
      .string()
      .min(1, { message: "Required" })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Must be a positive number",
      }),
  ]);

export const listCommentsSchema = z.object({
  taskId: idField(),
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(100).optional(),
});

export const createCommentSchema = z.object({
  taskId: idField(),
  comment: z.string().min(1),
});

export const updateCommentSchema = z.object({
  taskId: idField(),
  commentId: idField(),
  comment: z.string().min(1),
});

export const deleteCommentSchema = z.object({
  taskId: idField(),
  commentId: idField(),
});

export type ListCommentsInput = z.infer<typeof listCommentsSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;
