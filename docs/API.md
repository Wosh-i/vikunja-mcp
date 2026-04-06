# API Reference

Complete reference for all Vikunja-MCP tools.

---

## Utility Tools

### `ping`

Test if the MCP server is working and can communicate.

**Parameters:** None

**Returns:** Status message with timestamp

---

## Project Tools

### `list_projects`

List all projects the user has access to.

**Parameters:**

| Parameter  | Type   | Required | Description                |
| ---------- | ------ | -------- | -------------------------- |
| `page`     | number | No       | Page number for pagination |
| `per_page` | number | No       | Items per page (max 100)   |

---

### `get_project`

Get a single project by ID.

**Parameters:**

| Parameter   | Type          | Required | Description    |
| ----------- | ------------- | -------- | -------------- |
| `projectId` | number/string | Yes      | The project ID |

---

### `create_project`

Create a new project.

**Parameters:**

| Parameter           | Type    | Required | Description                       |
| ------------------- | ------- | -------- | --------------------------------- |
| `title`             | string  | Yes      | Project title                     |
| `description`       | string  | No       | Project description               |
| `hex_color`         | string  | No       | Hex color (e.g. #FF0000)          |
| `identifier`        | string  | No       | Project identifier (max 10 chars) |
| `parent_project_id` | number  | No       | Parent project ID for nesting     |
| `is_archived`       | boolean | No       | Whether the project is archived   |

---

### `update_project`

Update an existing project.

**Parameters:**

| Parameter     | Type          | Required | Description       |
| ------------- | ------------- | -------- | ----------------- |
| `projectId`   | number/string | Yes      | The project ID    |
| `title`       | string        | No       | New project title |
| `description` | string        | No       | New description   |
| `hex_color`   | string        | No       | New hex color     |
| `is_archived` | boolean       | No       | Archive/unarchive |
| `is_favorite` | boolean       | No       | Mark as favorite  |

---

### `delete_project`

Delete a project by ID.

**Parameters:**

| Parameter   | Type          | Required | Description    |
| ----------- | ------------- | -------- | -------------- |
| `projectId` | number/string | Yes      | The project ID |

---

### `list_project_children`

List all child projects of a project.

**Parameters:**

| Parameter   | Type          | Required | Description           |
| ----------- | ------------- | -------- | --------------------- |
| `projectId` | number/string | Yes      | The parent project ID |

---

### `move_project`

Move a project to a different parent or position.

**Parameters:**

| Parameter           | Type          | Required | Description                        |
| ------------------- | ------------- | -------- | ---------------------------------- |
| `projectId`         | number/string | Yes      | The project ID                     |
| `parent_project_id` | number        | No       | New parent project (null for root) |
| `position`          | number        | No       | Position in parent                 |

---

## Task Tools

### `list_tasks`

List all tasks across all projects.

**Parameters:**

| Parameter      | Type   | Required | Description              |
| -------------- | ------ | -------- | ------------------------ |
| `page`         | number | No       | Page number              |
| `per_page`     | number | No       | Items per page (max 100) |
| `search`       | string | No       | Search query             |
| `sort_by`      | string | No       | Field to sort by         |
| `order_by`     | string | No       | "asc" or "desc"          |
| `filter_by`    | string | No       | Field to filter by       |
| `filter_value` | string | No       | Value to filter by       |

---

### `list_project_tasks`

List all tasks for a specific project.

**Parameters:**

| Parameter   | Type          | Required | Description              |
| ----------- | ------------- | -------- | ------------------------ |
| `projectId` | number/string | Yes      | The project ID           |
| `page`      | number        | No       | Page number              |
| `per_page`  | number        | No       | Items per page (max 100) |

---

### `get_task`

Get a specific task by ID.

**Parameters:**

| Parameter | Type          | Required | Description                                                                   |
| --------- | ------------- | -------- | ----------------------------------------------------------------------------- |
| `taskId`  | number/string | Yes      | The task ID                                                                   |
| `expand`  | string        | No       | Expand related data: labels, assignees, comments, attachments, relations, all |

---

### `create_task`

Create a new task in a project.

**Parameters:**

| Parameter           | Type          | Required | Description              |
| ------------------- | ------------- | -------- | ------------------------ |
| `projectId`         | number/string | Yes      | The project ID           |
| `task.title`        | string        | Yes      | Task title               |
| `task.description`  | string        | No       | Task description         |
| `task.done`         | boolean       | No       | Whether the task is done |
| `task.due_date`     | string        | No       | Due date (ISO 8601)      |
| `task.start_date`   | string        | No       | Start date (ISO 8601)    |
| `task.end_date`     | string        | No       | End date (ISO 8601)      |
| `task.hex_color`    | string        | No       | Hex color                |
| `task.priority`     | number        | No       | Priority (0-5)           |
| `task.percent_done` | number        | No       | Progress (0-100)         |

---

### `update_task`

Update an existing task.

**Parameters:**

| Parameter     | Type          | Required | Description                            |
| ------------- | ------------- | -------- | -------------------------------------- |
| `taskId`      | number/string | Yes      | The task ID                            |
| `taskUpdates` | object        | No       | Fields to update (same as create_task) |

---

### `delete_task`

Delete a task by ID.

**Parameters:**

| Parameter | Type          | Required | Description |
| --------- | ------------- | -------- | ----------- |
| `taskId`  | number/string | Yes      | The task ID |

---

### `complete_task`

Mark a task as done.

**Parameters:**

| Parameter | Type          | Required | Description |
| --------- | ------------- | -------- | ----------- |
| `taskId`  | number/string | Yes      | The task ID |

---

### `reopen_task`

Reopen a completed task.

**Parameters:**

| Parameter | Type          | Required | Description |
| --------- | ------------- | -------- | ----------- |
| `taskId`  | number/string | Yes      | The task ID |

---

### `move_task`

Move a task to a different project or position.

**Parameters:**

| Parameter    | Type          | Required | Description                |
| ------------ | ------------- | -------- | -------------------------- |
| `taskId`     | number/string | Yes      | The task ID                |
| `project_id` | number/string | Yes      | The target project ID      |
| `position`   | number        | No       | Position in target project |

---

### `move_task_to_bucket`

Move a task to a different kanban bucket.

**Requires:** Project must have a Kanban view configured.

**Parameters:**

| Parameter   | Type          | Required | Description                        |
| ----------- | ------------- | -------- | ---------------------------------- |
| `taskId`    | number/string | Yes      | The task ID                        |
| `projectId` | number/string | Yes      | The project ID                     |
| `viewId`    | number/string | Yes      | The project view ID (kanban view)  |
| `bucketId`  | number/string | Yes      | The target bucket ID               |
| `position`  | number        | No       | Position within bucket (0 = first) |

**Example:** `move_task_to_bucket(taskId=25, projectId=4, viewId=16, bucketId=11)`

---

### `add_task_assignee`

Add a user as assignee to a task.

**Parameters:**

| Parameter | Type          | Required | Description |
| --------- | ------------- | -------- | ----------- |
| `taskId`  | number/string | Yes      | The task ID |
| `user_id` | number/string | Yes      | The user ID |

---

### `remove_task_assignee`

Remove a user from task assignees.

**Parameters:**

| Parameter | Type          | Required | Description |
| --------- | ------------- | -------- | ----------- |
| `taskId`  | number/string | Yes      | The task ID |
| `userId`  | number/string | Yes      | The user ID |

---

### `list_task_assignees`

List all assignees for a task.

**Parameters:**

| Parameter | Type          | Required | Description |
| --------- | ------------- | -------- | ----------- |
| `taskId`  | number/string | Yes      | The task ID |

---

### `add_task_label`

Add a label to a task.

**Parameters:**

| Parameter  | Type          | Required | Description  |
| ---------- | ------------- | -------- | ------------ |
| `taskId`   | number/string | Yes      | The task ID  |
| `label_id` | number/string | Yes      | The label ID |

---

### `remove_task_label`

Remove a label from a task.

**Parameters:**

| Parameter | Type          | Required | Description  |
| --------- | ------------- | -------- | ------------ |
| `taskId`  | number/string | Yes      | The task ID  |
| `labelId` | number/string | Yes      | The label ID |

---

### `list_task_labels`

List all labels for a task.

**Parameters:**

| Parameter | Type          | Required | Description |
| --------- | ------------- | -------- | ----------- |
| `taskId`  | number/string | Yes      | The task ID |

---

### `list_labels`

List all available labels.

**Parameters:**

| Parameter    | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| `project_id` | number | No       | Filter by project ID |

---

### `create_subtask`

Create a subtask under a parent task.

**Parameters:**

| Parameter        | Type          | Required | Description        |
| ---------------- | ------------- | -------- | ------------------ |
| `projectId`      | number/string | Yes      | The project ID     |
| `task`           | object        | Yes      | Subtask data       |
| `parent_task_id` | number/string | Yes      | The parent task ID |

---

### `list_subtasks`

List all subtasks for a task.

**Parameters:**

| Parameter | Type          | Required | Description        |
| --------- | ------------- | -------- | ------------------ |
| `taskId`  | number/string | Yes      | The parent task ID |

---

### `list_task_relations`

List all relations for a task.

**Parameters:**

| Parameter | Type          | Required | Description |
| --------- | ------------- | -------- | ----------- |
| `taskId`  | number/string | Yes      | The task ID |

---

### `delete_task_attachment`

Delete an attachment from a task.

**Parameters:**

| Parameter      | Type          | Required | Description       |
| -------------- | ------------- | -------- | ----------------- |
| `taskId`       | number/string | Yes      | The task ID       |
| `attachmentId` | number/string | Yes      | The attachment ID |

---

## Comment Tools

### `list_comments`

List all comments for a task.

**Parameters:**

| Parameter  | Type          | Required | Description    |
| ---------- | ------------- | -------- | -------------- |
| `taskId`   | number/string | Yes      | The task ID    |
| `page`     | number        | No       | Page number    |
| `per_page` | number        | No       | Items per page |

---

### `create_comment`

Add a comment to a task.

**Parameters:**

| Parameter | Type          | Required | Description      |
| --------- | ------------- | -------- | ---------------- |
| `taskId`  | number/string | Yes      | The task ID      |
| `comment` | string        | Yes      | The comment text |

---

### `update_comment`

Update a comment.

**Parameters:**

| Parameter   | Type          | Required | Description    |
| ----------- | ------------- | -------- | -------------- |
| `taskId`    | number/string | Yes      | The task ID    |
| `commentId` | number/string | Yes      | The comment ID |
| `comment`   | string        | Yes      | Updated text   |

---

### `delete_comment`

Delete a comment.

**Parameters:**

| Parameter   | Type          | Required | Description    |
| ----------- | ------------- | -------- | -------------- |
| `taskId`    | number/string | Yes      | The task ID    |
| `commentId` | number/string | Yes      | The comment ID |

---

## Relation Tools

### `create_relation`

Create a relation between two tasks.

**Parameters:**

| Parameter      | Type          | Required | Description        |
| -------------- | ------------- | -------- | ------------------ |
| `taskId`       | number/string | Yes      | The source task ID |
| `otherTaskId`  | number/string | Yes      | The target task ID |
| `relationKind` | string        | Yes      | Relation type      |

**Relation types:** subtask, parenttask, related, duplicateof, duplicates, blocking, blocked, precedes, follows, copiedfrom, copiedto

---

### `delete_relation`

Delete a relation between tasks.

**Parameters:**

| Parameter      | Type          | Required | Description        |
| -------------- | ------------- | -------- | ------------------ |
| `taskId`       | number/string | Yes      | The source task ID |
| `otherTaskId`  | number/string | Yes      | The target task ID |
| `relationKind` | string        | Yes      | Relation type      |

---

## Attachment Tools

### `list_attachments`

List all attachments for a task.

**Parameters:**

| Parameter  | Type          | Required | Description    |
| ---------- | ------------- | -------- | -------------- |
| `taskId`   | number/string | Yes      | The task ID    |
| `page`     | number        | No       | Page number    |
| `per_page` | number        | No       | Items per page |
