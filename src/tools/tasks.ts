import { z } from "zod";

const baseTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  done: z.boolean().optional(),
  due_date: z.string().datetime().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  hex_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  priority: z.number().int().min(0).max(5).optional(),
  percent_done: z.number().int().min(0).max(100).optional(),
  repeat_after: z.number().int().nonnegative().optional(),
  repeat_mode: z.number().int().min(0).max(2).optional(),
});

export const listTasksSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  sort_by: z.string().optional(),
  order_by: z.enum(["asc", "desc"]).optional(),
  filter_by: z.string().optional(),
  filter_value: z.string().optional(),
});

export const listProjectTasksSchema = z.object({
  projectId: z.number().int().positive(),
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(100).optional(),
});

export const getTaskSchema = z.object({
  taskId: z.number().int().positive(),
  expand: z
    .enum([
      "labels",
      "assignees",
      "comments",
      "attachments",
      "relations",
      "all",
    ])
    .optional(),
});

export const createTaskSchema = z.object({
  projectId: z.number().int().positive(),
  task: baseTaskSchema,
});

export const updateTaskSchema = z.object({
  taskId: z.number().int().positive(),
  taskUpdates: baseTaskSchema.partial(),
});

export const deleteTaskSchema = z.object({
  taskId: z.number().int().positive(),
});

export type ListTasksInput = z.infer<typeof listTasksSchema>;
export type ListProjectTasksInput = z.infer<typeof listProjectTasksSchema>;
export type GetTaskInput = z.infer<typeof getTaskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
