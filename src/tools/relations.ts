import { z } from "zod";

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
  taskId: z.number().int().positive(),
  otherTaskId: z.number().int().positive(),
  relationKind: relationKindSchema,
});

export const deleteRelationSchema = z.object({
  taskId: z.number().int().positive(),
  otherTaskId: z.number().int().positive(),
  relationKind: relationKindSchema,
});

export type CreateRelationInput = z.infer<typeof createRelationSchema>;
export type DeleteRelationInput = z.infer<typeof deleteRelationSchema>;
