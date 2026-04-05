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

const baseProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  hex_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  identifier: z.string().max(10).optional(),
  parent_project_id: z.number().int().positive().optional(),
  is_archived: z.boolean().optional(),
});

export const listProjectsSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(100).optional(),
});

export const getProjectSchema = z.object({
  projectId: idField(),
});

export const createProjectSchema = baseProjectSchema;

export const updateProjectSchema = baseProjectSchema
  .extend({
    is_favorite: z.boolean().optional(),
  })
  .partial();

export const deleteProjectSchema = z.object({
  projectId: idField(),
});

export const listProjectChildrenSchema = z.object({
  projectId: idField(),
});

export const moveProjectSchema = z.object({
  projectId: idField(),
  parent_project_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("The ID of the new parent project"),
  position: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("The position in the parent project"),
});

export type ListProjectsInput = z.infer<typeof listProjectsSchema>;
export type GetProjectInput = z.infer<typeof getProjectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
