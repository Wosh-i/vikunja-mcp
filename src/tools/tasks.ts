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
  priority: z.coerce.number().int().min(0).max(5).optional(),
  percent_done: z.coerce.number().int().min(0).max(100).optional(),
  repeat_after: z.coerce.number().int().nonnegative().optional(),
  repeat_mode: z.coerce.number().int().min(0).max(2).optional(),
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
  projectId: idField(),
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(100).optional(),
});

export const getTaskSchema = z.object({
  taskId: idField(),
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
  projectId: idField(),
  task: baseTaskSchema,
});

export const updateTaskSchema = z.object({
  taskId: idField(),
  taskUpdates: baseTaskSchema.partial(),
});

export const deleteTaskSchema = z.object({
  taskId: idField(),
});

export const completeTaskSchema = z.object({
  taskId: idField(),
});

export const reopenTaskSchema = z.object({
  taskId: idField(),
});

export const moveTaskSchema = z.object({
  taskId: idField(),
  project_id: idField().describe("The ID of the target project"),
  position: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("The position in the target project"),
});

export const addTaskAssigneeSchema = z.object({
  taskId: idField(),
  user_id: idField().describe("The ID of the user to add as assignee"),
});

export const removeTaskAssigneeSchema = z.object({
  taskId: idField(),
  userId: idField(),
});

export const listTaskAssigneesSchema = z.object({
  taskId: idField(),
});

export const addTaskLabelSchema = z.object({
  taskId: idField(),
  label_id: idField().describe("The ID of the label to add"),
});

export const removeTaskLabelSchema = z.object({
  taskId: idField(),
  labelId: idField(),
});

export const listTaskLabelsSchema = z.object({
  taskId: idField(),
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
  taskId: idField(),
});

export const listSubtasksSchema = z.object({
  taskId: idField(),
});

export const deleteTaskAttachmentSchema = z.object({
  taskId: idField(),
  attachmentId: idField(),
});

export const moveTaskToBucketSchema = z.object({
  taskId: idField().describe("The ID of the task to move"),
  projectId: idField().describe("The project ID"),
  viewId: idField().describe("The project view ID (must be a kanban view)"),
  bucketId: idField().describe("The target bucket ID"),
  position: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Position within the bucket"),
});

export type ListTasksInput = z.infer<typeof listTasksSchema>;
export type ListProjectTasksInput = z.infer<typeof listProjectTasksSchema>;
export type GetTaskInput = z.infer<typeof getTaskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
