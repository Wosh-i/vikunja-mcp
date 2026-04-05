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

export const completeTaskSchema = z.object({
  taskId: z.number().int().positive(),
});

export const reopenTaskSchema = z.object({
  taskId: z.number().int().positive(),
});

export const moveTaskSchema = z.object({
  taskId: z.number().int().positive(),
  project_id: z
    .number()
    .int()
    .positive()
    .describe("The ID of the target project"),
  position: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("The position in the target project"),
});

export const addTaskAssigneeSchema = z.object({
  taskId: z.number().int().positive(),
  user_id: z
    .number()
    .int()
    .positive()
    .describe("The ID of the user to add as assignee"),
});

export const removeTaskAssigneeSchema = z.object({
  taskId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export const listTaskAssigneesSchema = z.object({
  taskId: z.number().int().positive(),
});

export const addTaskLabelSchema = z.object({
  taskId: z.number().int().positive(),
  label_id: z.number().int().positive().describe("The ID of the label to add"),
});

export const removeTaskLabelSchema = z.object({
  taskId: z.number().int().positive(),
  labelId: z.number().int().positive(),
});

export const listTaskLabelsSchema = z.object({
  taskId: z.number().int().positive(),
});

export const listLabelsSchema = z.object({
  project_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Filter labels by project ID"),
});

export const listTaskRelationsSchema = z.object({
  taskId: z.number().int().positive(),
});

export const listSubtasksSchema = z.object({
  taskId: z.number().int().positive(),
});

export const deleteTaskAttachmentSchema = z.object({
  taskId: z.number().int().positive(),
  attachmentId: z.number().int().positive(),
});

export type ListTasksInput = z.infer<typeof listTasksSchema>;
export type ListProjectTasksInput = z.infer<typeof listProjectTasksSchema>;
export type GetTaskInput = z.infer<typeof getTaskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
