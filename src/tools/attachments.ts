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

export const listAttachmentsSchema = z.object({
  taskId: idField(),
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(100).optional(),
});

export type ListAttachmentsInput = z.infer<typeof listAttachmentsSchema>;
