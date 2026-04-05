import { z } from "zod";

export const listAttachmentsSchema = z.object({
  taskId: z.coerce.number().int().positive(),
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().max(100).optional(),
});

export type ListAttachmentsInput = z.infer<typeof listAttachmentsSchema>;
