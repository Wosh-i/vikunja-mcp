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

export const relationKindSchema = z.enum([
  "unknown",
  "subtask",
  "parenttask",
  "related",
  "duplicateof",
  "duplicates",
  "blocking",
  "blocked",
  "precedes",
  "follows",
  "copiedfrom",
  "copiedto",
]);

export const createRelationSchema = z.object({
  taskId: idField(),
  otherTaskId: idField(),
  relationKind: relationKindSchema,
});

export const deleteRelationSchema = z.object({
  taskId: idField(),
  otherTaskId: idField(),
  relationKind: relationKindSchema,
});

export type CreateRelationInput = z.infer<typeof createRelationSchema>;
export type DeleteRelationInput = z.infer<typeof deleteRelationSchema>;
