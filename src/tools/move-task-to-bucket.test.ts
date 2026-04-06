import { test, describe } from "node:test";
import assert from "node:assert";
import { ZodError } from "zod";
import { moveTaskToBucketSchema } from "./tasks.js";
import { projectTools, ToolDefinition } from "./index.js";

const findMoveTaskToBucketTool = (
  tools: ToolDefinition[],
): ToolDefinition | undefined => {
  return tools.find((tool) => tool.name === "move_task_to_bucket");
};

describe("moveTaskToBucketSchema - schema validation tests", () => {
  test("valid input with all required fields passes", () => {
    const input = {
      taskId: 1,
      projectId: 2,
      viewId: 3,
      bucketId: 4,
    };
    const result = moveTaskToBucketSchema.parse(input);
    assert.strictEqual(result.taskId, 1);
    assert.strictEqual(result.projectId, 2);
    assert.strictEqual(result.viewId, 3);
    assert.strictEqual(result.bucketId, 4);
  });

  test("valid input with all required fields as strings passes", () => {
    const input = {
      taskId: "1",
      projectId: "2",
      viewId: "3",
      bucketId: "4",
    };
    const result = moveTaskToBucketSchema.parse(input);
    assert.strictEqual(result.taskId, 1);
    assert.strictEqual(result.projectId, 2);
    assert.strictEqual(result.viewId, 3);
    assert.strictEqual(result.bucketId, 4);
  });

  test("valid input with optional position field passes", () => {
    const input = {
      taskId: 1,
      projectId: 2,
      viewId: 3,
      bucketId: 4,
      position: 0,
    };
    const result = moveTaskToBucketSchema.parse(input);
    assert.strictEqual(result.position, 0);
  });

  test("valid input with positive position passes", () => {
    const input = {
      taskId: 1,
      projectId: 2,
      viewId: 3,
      bucketId: 4,
      position: 5,
    };
    const result = moveTaskToBucketSchema.parse(input);
    assert.strictEqual(result.position, 5);
  });

  test("invalid taskId (empty string) fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: "",
        projectId: 2,
        viewId: 3,
        bucketId: 4,
      });
    }, ZodError);
  });

  test("invalid taskId (zero) fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 0,
        projectId: 2,
        viewId: 3,
        bucketId: 4,
      });
    }, ZodError);
  });

  test("invalid taskId (negative) fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: -1,
        projectId: 2,
        viewId: 3,
        bucketId: 4,
      });
    }, ZodError);
  });

  test("invalid projectId fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 1,
        projectId: 0,
        viewId: 3,
        bucketId: 4,
      });
    }, ZodError);
  });

  test("invalid projectId (negative) fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 1,
        projectId: -5,
        viewId: 3,
        bucketId: 4,
      });
    }, ZodError);
  });

  test("invalid projectId (empty string) fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 1,
        projectId: "",
        viewId: 3,
        bucketId: 4,
      });
    }, ZodError);
  });

  test("invalid viewId fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 1,
        projectId: 2,
        viewId: 0,
        bucketId: 4,
      });
    }, ZodError);
  });

  test("invalid viewId (negative) fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 1,
        projectId: 2,
        viewId: -3,
        bucketId: 4,
      });
    }, ZodError);
  });

  test("invalid bucketId fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 1,
        projectId: 2,
        viewId: 3,
        bucketId: 0,
      });
    }, ZodError);
  });

  test("invalid bucketId (negative) fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 1,
        projectId: 2,
        viewId: 3,
        bucketId: -4,
      });
    }, ZodError);
  });

  test("invalid position (negative number) fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 1,
        projectId: 2,
        viewId: 3,
        bucketId: 4,
        position: -1,
      });
    }, ZodError);
  });

  test("invalid position (negative decimal) fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 1,
        projectId: 2,
        viewId: 3,
        bucketId: 4,
        position: -0.5,
      });
    }, ZodError);
  });
});

describe("import tests", () => {
  test("schema can be imported from tasks.ts", () => {
    assert.ok(moveTaskToBucketSchema !== undefined);
    assert.ok(typeof moveTaskToBucketSchema.parse === "function");
  });

  test("tool definition can be imported from index.ts", () => {
    const tool = findMoveTaskToBucketTool(projectTools);
    assert.ok(tool !== undefined);
    assert.strictEqual(tool?.name, "move_task_to_bucket");
    assert.strictEqual(
      tool?.description,
      "Move a task to a different kanban bucket",
    );
    assert.ok(tool?.inputSchema !== undefined);
    assert.ok(tool?.handler !== undefined);
  });

  test("tool definition has correct input schema fields", () => {
    const tool = findMoveTaskToBucketTool(projectTools);
    assert.ok(tool !== undefined);
    assert.strictEqual(
      tool!.inputSchema.shape.taskId.description,
      "The ID of the task to move",
    );
    assert.strictEqual(
      tool!.inputSchema.shape.projectId.description,
      "The project ID",
    );
    assert.strictEqual(
      tool!.inputSchema.shape.viewId.description,
      "The project view ID (must be a kanban view)",
    );
    assert.strictEqual(
      tool!.inputSchema.shape.bucketId.description,
      "The target bucket ID",
    );
    assert.strictEqual(
      tool!.inputSchema.shape.position.description,
      "Position within the bucket",
    );
  });
});

describe("edge cases", () => {
  test("valid input with all ID fields as string numbers and position as number passes", () => {
    const input = {
      taskId: "123",
      projectId: "456",
      viewId: "789",
      bucketId: "101112",
      position: 5,
    };
    const result = moveTaskToBucketSchema.parse(input);
    assert.strictEqual(result.taskId, 123);
    assert.strictEqual(result.projectId, 456);
    assert.strictEqual(result.viewId, 789);
    assert.strictEqual(result.bucketId, 101112);
    assert.strictEqual(result.position, 5);
  });

  test("position defaults to undefined when not provided", () => {
    const input = {
      taskId: 1,
      projectId: 2,
      viewId: 3,
      bucketId: 4,
    };
    const result = moveTaskToBucketSchema.parse(input);
    assert.strictEqual(result.position, undefined);
  });

  test("non-integer position fails", () => {
    assert.throws(() => {
      moveTaskToBucketSchema.parse({
        taskId: 1,
        projectId: 2,
        viewId: 3,
        bucketId: 4,
        position: 1.5,
      });
    }, ZodError);
  });
});
