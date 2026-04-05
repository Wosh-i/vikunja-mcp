import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { VikunjaApiClient, VikunjaApiError } from "../client.js";

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
import {
  listProjectsSchema,
  getProjectSchema,
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
  listProjectChildrenSchema,
  moveProjectSchema,
} from "./projects.js";
import {
  listTasksSchema,
  listProjectTasksSchema,
  getTaskSchema,
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
  completeTaskSchema,
  reopenTaskSchema,
  moveTaskSchema,
  addTaskAssigneeSchema,
  removeTaskAssigneeSchema,
  listTaskAssigneesSchema,
  addTaskLabelSchema,
  removeTaskLabelSchema,
  listTaskLabelsSchema,
  listLabelsSchema,
  listTaskRelationsSchema,
  listSubtasksSchema,
  deleteTaskAttachmentSchema,
} from "./tasks.js";
import {
  listCommentsSchema,
  createCommentSchema,
  updateCommentSchema,
  deleteCommentSchema,
} from "./comments.js";
import { createRelationSchema, deleteRelationSchema } from "./relations.js";
import { listAttachmentsSchema } from "./attachments.js";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodObject<any>;
  jsonSchema: any;
  handler: (
    client: VikunjaApiClient,
    args: unknown,
  ) => Promise<{
    content: Array<{ type: "text"; text: string }>;
    isError?: boolean;
  }>;
}

function handleError(error: unknown): {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
} {
  if (error instanceof VikunjaApiError) {
    return {
      content: [{ type: "text", text: `Vikunja API Error: ${error.message}` }],
      isError: true,
    };
  }
  if (error instanceof z.ZodError) {
    return {
      content: [{ type: "text", text: `Validation Error: ${error.message}` }],
      isError: true,
    };
  }
  if (error instanceof Error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
  return {
    content: [{ type: "text", text: "An unknown error occurred" }],
    isError: true,
  };
}

export const projectTools: ToolDefinition[] = [
  {
    name: "list_projects",
    description: "List all projects the user has access to",
    inputSchema: z.object({
      page: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Page number for pagination"),
      per_page: z
        .number()
        .int()
        .positive()
        .max(100)
        .optional()
        .describe("Number of items per page (max 100)"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        page: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Page number for pagination"),
        per_page: z
          .number()
          .int()
          .positive()
          .max(100)
          .optional()
          .describe("Number of items per page (max 100)"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = listProjectsSchema.parse(args);
        const params = new URLSearchParams();
        if (parsed.page) params.set("page", String(parsed.page));
        if (parsed.per_page) params.set("per_page", String(parsed.per_page));

        const queryString = params.toString();
        const path = `/projects${queryString ? `?${queryString}` : ""}`;
        const result = await client.getList<unknown>(path);

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "get_project",
    description: "Get a specific project by ID",
    inputSchema: z.object({
      projectId: idField().describe("The ID of the project"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        projectId: idField().describe("The ID of the project"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = getProjectSchema.parse(args);
        const result = await client.get<unknown>(
          `/projects/${parsed.projectId}`,
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "create_project",
    description: "Create a new project",
    inputSchema: z.object({
      title: z.string().min(1).describe("Project title"),
      description: z.string().optional().describe("Project description"),
      hex_color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .optional()
        .describe("Hex color code (e.g. #FF0000)"),
      identifier: z
        .string()
        .max(10)
        .optional()
        .describe("Project identifier (0-10 characters)"),
      parent_project_id: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("ID of the parent project"),
      is_archived: z
        .boolean()
        .optional()
        .describe("Whether the project is archived"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        title: z.string().min(1).describe("Project title"),
        description: z.string().optional().describe("Project description"),
        hex_color: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional()
          .describe("Hex color code (e.g. #FF0000)"),
        identifier: z
          .string()
          .max(10)
          .optional()
          .describe("Project identifier (0-10 characters)"),
        parent_project_id: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("ID of the parent project"),
        is_archived: z
          .boolean()
          .optional()
          .describe("Whether the project is archived"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = createProjectSchema.parse(args);
        const result = await client.put<unknown>("/projects", parsed);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "update_project",
    description: "Update an existing project",
    inputSchema: z.object({
      projectId: idField().describe("The ID of the project to update"),
      title: z.string().min(1).optional().describe("Project title"),
      description: z.string().optional().describe("Project description"),
      hex_color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .optional()
        .describe("Hex color code (e.g. #FF0000)"),
      identifier: z
        .string()
        .max(10)
        .optional()
        .describe("Project identifier (0-10 characters)"),
      parent_project_id: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("ID of the parent project"),
      is_archived: z
        .boolean()
        .optional()
        .describe("Whether the project is archived"),
      is_favorite: z
        .boolean()
        .optional()
        .describe("Whether the project is favorited"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        projectId: idField().describe("The ID of the project to update"),
        title: z.string().min(1).optional().describe("Project title"),
        description: z.string().optional().describe("Project description"),
        hex_color: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional()
          .describe("Hex color code (e.g. #FF0000)"),
        identifier: z
          .string()
          .max(10)
          .optional()
          .describe("Project identifier (0-10 characters)"),
        parent_project_id: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("ID of the parent project"),
        is_archived: z
          .boolean()
          .optional()
          .describe("Whether the project is archived"),
        is_favorite: z
          .boolean()
          .optional()
          .describe("Whether the project is favorited"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const { projectId, ...updates } = args as {
          projectId: number;
        } & Partial<ReturnType<typeof updateProjectSchema.parse>>;
        const result = await client.post<unknown>(
          `/projects/${projectId}`,
          updates,
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "delete_project",
    description: "Delete a project by ID",
    inputSchema: z.object({
      projectId: idField().describe("The ID of the project to delete"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        projectId: idField().describe("The ID of the project to delete"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = deleteProjectSchema.parse(args);
        await client.delete<unknown>(`/projects/${parsed.projectId}`);
        return {
          content: [
            {
              type: "text",
              text: `Project ${parsed.projectId} deleted successfully`,
            },
          ],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "list_project_children",
    description: "List all child projects of a project",
    inputSchema: z.object({
      projectId: idField().describe("The ID of the parent project"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        projectId: idField().describe("The ID of the parent project"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = listProjectChildrenSchema.parse(args);
        const result = await client.getList<unknown>(
          `/projects/${parsed.projectId}/projects`,
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "move_project",
    description: "Move a project to a different parent or position",
    inputSchema: z.object({
      projectId: idField().describe("The ID of the project to move"),
      parent_project_id: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("The ID of the new parent project (null to move to root)"),
      position: z
        .number()
        .int()
        .nonnegative()
        .optional()
        .describe("The position in the parent project"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        projectId: idField().describe("The ID of the project to move"),
        parent_project_id: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("The ID of the new parent project (null to move to root)"),
        position: z
          .number()
          .int()
          .nonnegative()
          .optional()
          .describe("The position in the parent project"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = moveProjectSchema.parse(args);
        const result = await client.post<unknown>(
          `/projects/${parsed.projectId}/move`,
          {
            parent_project_id: parsed.parent_project_id,
            position: parsed.position,
          },
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
];

export const taskTools: ToolDefinition[] = [
  {
    name: "list_tasks",
    description: "List all tasks across all projects",
    inputSchema: z.object({
      page: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Page number for pagination"),
      per_page: z
        .number()
        .int()
        .positive()
        .max(100)
        .optional()
        .describe("Number of items per page (max 100)"),
      search: z.string().optional().describe("Search query"),
      sort_by: z.string().optional().describe("Field to sort by"),
      order_by: z.enum(["asc", "desc"]).optional().describe("Sort order"),
      filter_by: z.string().optional().describe("Field to filter by"),
      filter_value: z.string().optional().describe("Value to filter by"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        page: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Page number for pagination"),
        per_page: z
          .number()
          .int()
          .positive()
          .max(100)
          .optional()
          .describe("Number of items per page (max 100)"),
        search: z.string().optional().describe("Search query"),
        sort_by: z.string().optional().describe("Field to sort by"),
        order_by: z.enum(["asc", "desc"]).optional().describe("Sort order"),
        filter_by: z.string().optional().describe("Field to filter by"),
        filter_value: z.string().optional().describe("Value to filter by"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = listTasksSchema.parse(args);
        const params = new URLSearchParams();
        if (parsed.page) params.set("page", String(parsed.page));
        if (parsed.per_page) params.set("per_page", String(parsed.per_page));
        if (parsed.search) params.set("search", parsed.search);
        if (parsed.sort_by) params.set("sort_by", parsed.sort_by);
        if (parsed.order_by) params.set("order_by", parsed.order_by);
        if (parsed.filter_by) params.set("filter_by", parsed.filter_by);
        if (parsed.filter_value)
          params.set("filter_value", parsed.filter_value);

        const queryString = params.toString();
        const path = `/tasks${queryString ? `?${queryString}` : ""}`;
        const result = await client.getList<unknown>(path);

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "list_project_tasks",
    description: "List all tasks for a specific project",
    inputSchema: z.object({
      projectId: idField().describe("The ID of the project"),
      page: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Page number for pagination"),
      per_page: z
        .number()
        .int()
        .positive()
        .max(100)
        .optional()
        .describe("Number of items per page (max 100)"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        projectId: idField().describe("The ID of the project"),
        page: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Page number for pagination"),
        per_page: z
          .number()
          .int()
          .positive()
          .max(100)
          .optional()
          .describe("Number of items per page (max 100)"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = listProjectTasksSchema.parse(args);
        const params = new URLSearchParams();
        if (parsed.page) params.set("page", String(parsed.page));
        if (parsed.per_page) params.set("per_page", String(parsed.per_page));

        const queryString = params.toString();
        const path = `/projects/${parsed.projectId}/tasks${queryString ? `?${queryString}` : ""}`;
        const result = await client.getList<unknown>(path);

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "get_task",
    description: "Get a specific task by ID",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      expand: z
        .enum([
          "labels",
          "assignees",
          "comments",
          "attachments",
          "relations",
          "all",
        ])
        .optional()
        .describe("Expand related data"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        expand: z
          .enum([
            "labels",
            "assignees",
            "comments",
            "attachments",
            "relations",
            "all",
          ])
          .optional()
          .describe("Expand related data"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = getTaskSchema.parse(args);
        const params = new URLSearchParams();
        if (parsed.expand) params.set("expand", parsed.expand);

        const queryString = params.toString();
        const path = `/tasks/${parsed.taskId}${queryString ? `?${queryString}` : ""}`;
        const result = await client.get<unknown>(path);

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "create_task",
    description: "Create a new task in a project",
    inputSchema: z.object({
      projectId: idField().describe("The ID of the project"),
      task: z
        .object({
          title: z.string().min(1).describe("Task title"),
          description: z.string().optional().describe("Task description"),
          done: z.boolean().optional().describe("Whether the task is done"),
          due_date: z
            .string()
            .datetime()
            .optional()
            .describe("Due date (ISO 8601 format)"),
          start_date: z
            .string()
            .datetime()
            .optional()
            .describe("Start date (ISO 8601 format)"),
          end_date: z
            .string()
            .datetime()
            .optional()
            .describe("End date (ISO 8601 format)"),
          hex_color: z
            .string()
            .regex(/^#[0-9A-Fa-f]{6}$/)
            .optional()
            .describe("Hex color code (e.g. #FF0000)"),
          priority: z
            .number()
            .int()
            .min(0)
            .max(5)
            .optional()
            .describe("Priority (0-5)"),
          percent_done: z
            .number()
            .int()
            .min(0)
            .max(100)
            .optional()
            .describe("Progress percentage (0-100)"),
          repeat_after: z
            .number()
            .int()
            .nonnegative()
            .optional()
            .describe("Repeat after duration in seconds"),
          repeat_mode: z
            .number()
            .int()
            .min(0)
            .max(2)
            .optional()
            .describe("Repeat mode (0, 1, or 2)"),
        })
        .describe("Task data"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        projectId: idField().describe("The ID of the project"),
        task: z
          .object({
            title: z.string().min(1).describe("Task title"),
            description: z.string().optional().describe("Task description"),
            done: z.boolean().optional().describe("Whether the task is done"),
            due_date: z
              .string()
              .datetime()
              .optional()
              .describe("Due date (ISO 8601 format)"),
            start_date: z
              .string()
              .datetime()
              .optional()
              .describe("Start date (ISO 8601 format)"),
            end_date: z
              .string()
              .datetime()
              .optional()
              .describe("End date (ISO 8601 format)"),
            hex_color: z
              .string()
              .regex(/^#[0-9A-Fa-f]{6}$/)
              .optional()
              .describe("Hex color code (e.g. #FF0000)"),
            priority: z
              .number()
              .int()
              .min(0)
              .max(5)
              .optional()
              .describe("Priority (0-5)"),
            percent_done: z
              .number()
              .int()
              .min(0)
              .max(100)
              .optional()
              .describe("Progress percentage (0-100)"),
            repeat_after: z
              .number()
              .int()
              .nonnegative()
              .optional()
              .describe("Repeat after duration in seconds"),
            repeat_mode: z
              .number()
              .int()
              .min(0)
              .max(2)
              .optional()
              .describe("Repeat mode (0, 1, or 2)"),
          })
          .describe("Task data"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = createTaskSchema.parse(args);
        const result = await client.put<unknown>(
          `/projects/${parsed.projectId}/tasks`,
          parsed.task,
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "update_task",
    description: "Update an existing task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task to update"),
      taskUpdates: z
        .object({
          title: z.string().min(1).optional().describe("Task title"),
          description: z.string().optional().describe("Task description"),
          done: z.boolean().optional().describe("Whether the task is done"),
          due_date: z
            .string()
            .datetime()
            .optional()
            .describe("Due date (ISO 8601 format)"),
          start_date: z
            .string()
            .datetime()
            .optional()
            .describe("Start date (ISO 8601 format)"),
          end_date: z
            .string()
            .datetime()
            .optional()
            .describe("End date (ISO 8601 format)"),
          hex_color: z
            .string()
            .regex(/^#[0-9A-Fa-f]{6}$/)
            .optional()
            .describe("Hex color code (e.g. #FF0000)"),
          priority: z
            .number()
            .int()
            .min(0)
            .max(5)
            .optional()
            .describe("Priority (0-5)"),
          percent_done: z
            .number()
            .int()
            .min(0)
            .max(100)
            .optional()
            .describe("Progress percentage (0-100)"),
          repeat_after: z
            .number()
            .int()
            .nonnegative()
            .optional()
            .describe("Repeat after duration in seconds"),
          repeat_mode: z
            .number()
            .int()
            .min(0)
            .max(2)
            .optional()
            .describe("Repeat mode (0, 1, or 2)"),
        })
        .describe("Task updates"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task to update"),
        taskUpdates: z
          .object({
            title: z.string().min(1).optional().describe("Task title"),
            description: z.string().optional().describe("Task description"),
            done: z.boolean().optional().describe("Whether the task is done"),
            due_date: z
              .string()
              .datetime()
              .optional()
              .describe("Due date (ISO 8601 format)"),
            start_date: z
              .string()
              .datetime()
              .optional()
              .describe("Start date (ISO 8601 format)"),
            end_date: z
              .string()
              .datetime()
              .optional()
              .describe("End date (ISO 8601 format)"),
            hex_color: z
              .string()
              .regex(/^#[0-9A-Fa-f]{6}$/)
              .optional()
              .describe("Hex color code (e.g. #FF0000)"),
            priority: z
              .number()
              .int()
              .min(0)
              .max(5)
              .optional()
              .describe("Priority (0-5)"),
            percent_done: z
              .number()
              .int()
              .min(0)
              .max(100)
              .optional()
              .describe("Progress percentage (0-100)"),
            repeat_after: z
              .number()
              .int()
              .nonnegative()
              .optional()
              .describe("Repeat after duration in seconds"),
            repeat_mode: z
              .number()
              .int()
              .min(0)
              .max(2)
              .optional()
              .describe("Repeat mode (0, 1, or 2)"),
          })
          .describe("Task updates"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = updateTaskSchema.parse(args);
        const result = await client.post<unknown>(
          `/tasks/${parsed.taskId}`,
          parsed.taskUpdates,
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "delete_task",
    description: "Delete a task by ID",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task to delete"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task to delete"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = deleteTaskSchema.parse(args);
        await client.delete<unknown>(`/tasks/${parsed.taskId}`);
        return {
          content: [
            {
              type: "text",
              text: `Task ${parsed.taskId} deleted successfully`,
            },
          ],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "complete_task",
    description: "Mark a task as done",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task to mark as done"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task to mark as done"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = completeTaskSchema.parse(args);
        const result = await client.post<unknown>(
          `/tasks/${parsed.taskId}/complete`,
          {},
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "reopen_task",
    description: "Reopen a completed task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task to reopen"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task to reopen"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = reopenTaskSchema.parse(args);
        const result = await client.post<unknown>(
          `/tasks/${parsed.taskId}/reopen`,
          {},
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "move_task",
    description: "Move a task to a different project or position",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task to move"),
      project_id: idField().describe("The ID of the target project"),
      position: z
        .number()
        .int()
        .nonnegative()
        .optional()
        .describe("The position in the target project"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task to move"),
        project_id: idField().describe("The ID of the target project"),
        position: z
          .number()
          .int()
          .nonnegative()
          .optional()
          .describe("The position in the target project"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = moveTaskSchema.parse(args);
        const result = await client.post<unknown>(
          `/tasks/${parsed.taskId}/move`,
          {
            project_id: parsed.project_id,
            position: parsed.position,
          },
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "add_task_assignee",
    description: "Add a user as assignee to a task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      user_id: idField().describe("The ID of the user to add as assignee"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        user_id: idField().describe("The ID of the user to add as assignee"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = addTaskAssigneeSchema.parse(args);
        const result = await client.put<unknown>(
          `/tasks/${parsed.taskId}/assignees`,
          { user_id: parsed.user_id },
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "remove_task_assignee",
    description: "Remove a user from task assignees",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      userId: idField().describe("The ID of the user to remove"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        userId: idField().describe("The ID of the user to remove"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = removeTaskAssigneeSchema.parse(args);
        await client.delete<unknown>(
          `/tasks/${parsed.taskId}/assignees/${parsed.userId}`,
        );
        return {
          content: [{ type: "text", text: "Assignee removed successfully" }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "list_task_assignees",
    description: "List all assignees for a task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = listTaskAssigneesSchema.parse(args);
        const result = await client.getList<unknown>(
          `/tasks/${parsed.taskId}/assignees`,
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "add_task_label",
    description: "Add a label to a task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      label_id: idField().describe("The ID of the label to add"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        label_id: idField().describe("The ID of the label to add"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = addTaskLabelSchema.parse(args);
        const result = await client.put<unknown>(
          `/tasks/${parsed.taskId}/labels`,
          { label_id: parsed.label_id },
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "remove_task_label",
    description: "Remove a label from a task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      labelId: idField().describe("The ID of the label to remove"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        labelId: idField().describe("The ID of the label to remove"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = removeTaskLabelSchema.parse(args);
        await client.delete<unknown>(
          `/tasks/${parsed.taskId}/labels/${parsed.labelId}`,
        );
        return {
          content: [{ type: "text", text: "Label removed successfully" }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "list_task_labels",
    description: "List all labels for a task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = listTaskLabelsSchema.parse(args);
        const result = await client.getList<unknown>(
          `/tasks/${parsed.taskId}/labels`,
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "list_labels",
    description: "List all available labels",
    inputSchema: z.object({
      project_id: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Filter labels by project ID"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        project_id: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Filter labels by project ID"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = listLabelsSchema.parse(args);
        const params = new URLSearchParams();
        if (parsed.project_id)
          params.set("project_id", String(parsed.project_id));

        const queryString = params.toString();
        const path = `/labels${queryString ? `?${queryString}` : ""}`;
        const result = await client.getList<unknown>(path);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "list_task_relations",
    description: "List all relations for a task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = listTaskRelationsSchema.parse(args);
        const result = await client.getList<unknown>(
          `/tasks/${parsed.taskId}/relations`,
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "create_subtask",
    description: "Create a subtask under a parent task",
    inputSchema: z.object({
      projectId: idField().describe("The ID of the project for the subtask"),
      task: z
        .object({
          title: z.string().min(1).describe("Subtask title"),
          description: z.string().optional().describe("Subtask description"),
          done: z.boolean().optional().describe("Whether the subtask is done"),
          due_date: z
            .string()
            .datetime()
            .optional()
            .describe("Due date (ISO 8601 format)"),
          start_date: z
            .string()
            .datetime()
            .optional()
            .describe("Start date (ISO 8601 format)"),
          end_date: z
            .string()
            .datetime()
            .optional()
            .describe("End date (ISO 8601 format)"),
          hex_color: z
            .string()
            .regex(/^#[0-9A-Fa-f]{6}$/)
            .optional()
            .describe("Hex color code (e.g. #FF0000)"),
          priority: z
            .number()
            .int()
            .min(0)
            .max(5)
            .optional()
            .describe("Priority (0-5)"),
          percent_done: z
            .number()
            .int()
            .min(0)
            .max(100)
            .optional()
            .describe("Progress percentage (0-100)"),
          repeat_after: z
            .number()
            .int()
            .nonnegative()
            .optional()
            .describe("Repeat after duration in seconds"),
          repeat_mode: z
            .number()
            .int()
            .min(0)
            .max(2)
            .optional()
            .describe("Repeat mode (0, 1, or 2)"),
        })
        .describe("Subtask data"),
      parent_task_id: idField().describe("The ID of the parent task"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        projectId: idField().describe("The ID of the project for the subtask"),
        task: z
          .object({
            title: z.string().min(1).describe("Subtask title"),
            description: z.string().optional().describe("Subtask description"),
            done: z
              .boolean()
              .optional()
              .describe("Whether the subtask is done"),
            due_date: z
              .string()
              .datetime()
              .optional()
              .describe("Due date (ISO 8601 format)"),
            start_date: z
              .string()
              .datetime()
              .optional()
              .describe("Start date (ISO 8601 format)"),
            end_date: z
              .string()
              .datetime()
              .optional()
              .describe("End date (ISO 8601 format)"),
            hex_color: z
              .string()
              .regex(/^#[0-9A-Fa-f]{6}$/)
              .optional()
              .describe("Hex color code (e.g. #FF0000)"),
            priority: z
              .number()
              .int()
              .min(0)
              .max(5)
              .optional()
              .describe("Priority (0-5)"),
            percent_done: z
              .number()
              .int()
              .min(0)
              .max(100)
              .optional()
              .describe("Progress percentage (0-100)"),
            repeat_after: z
              .number()
              .int()
              .nonnegative()
              .optional()
              .describe("Repeat after duration in seconds"),
            repeat_mode: z
              .number()
              .int()
              .min(0)
              .max(2)
              .optional()
              .describe("Repeat mode (0, 1, or 2)"),
          })
          .describe("Subtask data"),
        parent_task_id: idField().describe("The ID of the parent task"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const { projectId, task, parent_task_id } = args as {
          projectId: number;
          task: Record<string, unknown>;
          parent_task_id: number;
        };
        const taskResult = await client.put<unknown>(
          `/projects/${projectId}/tasks`,
          task,
        );
        const result = await client.put<unknown>(
          `/tasks/${parent_task_id}/relations`,
          {
            other_task_id: (taskResult as { id: number }).id,
            relation_kind: "subtask",
          },
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "list_subtasks",
    description: "List all subtasks for a task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the parent task"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the parent task"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = listSubtasksSchema.parse(args);
        const result = await client.getList<unknown>(
          `/tasks/${parsed.taskId}/relations?kind=subtask`,
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "delete_task_attachment",
    description: "Delete an attachment from a task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      attachmentId: idField().describe("The ID of the attachment to delete"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        attachmentId: idField().describe("The ID of the attachment to delete"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = deleteTaskAttachmentSchema.parse(args);
        await client.delete<unknown>(
          `/tasks/${parsed.taskId}/attachments/${parsed.attachmentId}`,
        );
        return {
          content: [
            {
              type: "text",
              text: "Attachment deleted successfully",
            },
          ],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
];

export const commentTools: ToolDefinition[] = [
  {
    name: "list_comments",
    description: "List all comments for a specific task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      page: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Page number for pagination"),
      per_page: z
        .number()
        .int()
        .positive()
        .max(100)
        .optional()
        .describe("Number of items per page (max 100)"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        commentId: idField().describe("The ID of the comment"),
        comment: z.string().min(1).describe("The updated comment text"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = updateCommentSchema.parse(args);
        const result = await client.post<unknown>(
          `/tasks/${parsed.taskId}/comments/${parsed.commentId}`,
          { comment: parsed.comment },
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "delete_comment",
    description: "Delete a comment from a task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      commentId: idField().describe("The ID of the comment"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        commentId: idField().describe("The ID of the comment"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = deleteCommentSchema.parse(args);
        await client.delete<unknown>(
          `/tasks/${parsed.taskId}/comments/${parsed.commentId}`,
        );
        return {
          content: [
            {
              type: "text",
              text: `Comment ${parsed.commentId} deleted successfully`,
            },
          ],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
];

export const relationTools: ToolDefinition[] = [
  {
    name: "create_relation",
    description: "Create a relation between two tasks",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      otherTaskId: idField().describe("The ID of the other task"),
      relationKind: z
        .enum([
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
        ])
        .describe("The type of relation"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        otherTaskId: idField().describe("The ID of the other task"),
        relationKind: z
          .enum([
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
          ])
          .describe("The type of relation"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = createRelationSchema.parse(args);
        const result = await client.put<unknown>(
          `/tasks/${parsed.taskId}/relations`,
          {
            other_task_id: parsed.otherTaskId,
            relation_kind: parsed.relationKind,
          },
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
  {
    name: "delete_relation",
    description: "Delete a relation between two tasks",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      otherTaskId: idField().describe("The ID of the other task"),
      relationKind: z
        .enum([
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
        ])
        .describe("The type of relation"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        otherTaskId: idField().describe("The ID of the other task"),
        relationKind: z
          .enum([
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
          ])
          .describe("The type of relation"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = deleteRelationSchema.parse(args);
        await client.delete<unknown>(
          `/tasks/${parsed.taskId}/relations/${parsed.relationKind}/${parsed.otherTaskId}`,
        );
        return {
          content: [{ type: "text", text: "Relation deleted successfully" }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
];

export const attachmentTools: ToolDefinition[] = [
  {
    name: "list_attachments",
    description: "List all attachments for a specific task",
    inputSchema: z.object({
      taskId: idField().describe("The ID of the task"),
      page: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Page number for pagination"),
      per_page: z
        .number()
        .int()
        .positive()
        .max(100)
        .optional()
        .describe("Number of items per page (max 100)"),
    }),
    jsonSchema: zodToJsonSchema(
      z.object({
        taskId: idField().describe("The ID of the task"),
        page: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Page number for pagination"),
        per_page: z
          .number()
          .int()
          .positive()
          .max(100)
          .optional()
          .describe("Number of items per page (max 100)"),
      }),
      "inputSchema",
    ),
    handler: async (client, args) => {
      try {
        const parsed = listAttachmentsSchema.parse(args);
        const params = new URLSearchParams();
        if (parsed.page) params.set("page", String(parsed.page));
        if (parsed.per_page) params.set("per_page", String(parsed.per_page));

        const queryString = params.toString();
        const path = `/tasks/${parsed.taskId}/attachments${queryString ? `?${queryString}` : ""}`;
        const result = await client.getList<unknown>(path);

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return handleError(error);
      }
    },
  },
];

export const tools: ToolDefinition[] = [
  ...projectTools,
  ...taskTools,
  ...commentTools,
  ...relationTools,
  ...attachmentTools,
];
