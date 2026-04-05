import { z } from "zod";

export const listAttachmentsSchema = z.object({
  taskId: z.number().int().positive(),
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(100).optional(),
});

export type ListAttachmentsInput = z.infer<typeof listAttachmentsSchema>;
