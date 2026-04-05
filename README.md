# Vikunja MCP Server

A Model Context Protocol server for managing Vikunja projects and tasks.

## Quick Start

Run directly with npx (no installation required):

```bash
npx vikunja-mcp --token YOUR_VIKUNJA_TOKEN
```

With custom Vikunja URL:

```bash
npx vikunja-mcp --url https://your-vikunja.com/api/v1 --token YOUR_TOKEN
```

Or using environment variables:

```bash
export VIKUNJA_TOKEN=your_token
export VIKUNJA_URL=https://your-vikunja.com/api/v1
npx vikunja-mcp
```

## Features

- Full CRUD operations for projects
- Full CRUD operations for tasks
- Task comments management
- Task relations (subtasks, blocking, etc.)
- Task attachments listing
- Task assignees management
- Task labels management
- Project hierarchy (epics) management

## Available Tools

### Projects

| Tool                    | Description                               |
| ----------------------- | ----------------------------------------- |
| `list_projects`         | List all projects the user has access to  |
| `get_project`           | Get a specific project by ID              |
| `create_project`        | Create a new project                      |
| `update_project`        | Update an existing project                |
| `delete_project`        | Delete a project by ID                    |
| `list_project_children` | List child projects under a project       |
| `move_project`          | Move project to different parent/position |

### Tasks

| Tool                 | Description                           |
| -------------------- | ------------------------------------- |
| `list_tasks`         | List all tasks across all projects    |
| `list_project_tasks` | List all tasks for a specific project |
| `get_task`           | Get a specific task by ID             |
| `create_task`        | Create a new task in a project        |
| `update_task`        | Update an existing task               |
| `delete_task`        | Delete a task by ID                   |

### Task State & Movement

| Tool            | Description                             |
| --------------- | --------------------------------------- |
| `complete_task` | Mark a task as done                     |
| `reopen_task`   | Reopen a completed task                 |
| `move_task`     | Move task to different project/position |

### Assignees

| Tool                   | Description                      |
| ---------------------- | -------------------------------- |
| `add_task_assignee`    | Add a user as assignee to a task |
| `remove_task_assignee` | Remove assignee from a task      |
| `list_task_assignees`  | List all assignees for a task    |

### Labels

| Tool                | Description                          |
| ------------------- | ------------------------------------ |
| `add_task_label`    | Add a label to a task                |
| `remove_task_label` | Remove a label from a task           |
| `list_task_labels`  | List all labels on a task            |
| `list_labels`       | List all available labels (globally) |

### Comments

| Tool             | Description                  |
| ---------------- | ---------------------------- |
| `list_comments`  | List all comments for a task |
| `create_comment` | Add a comment to a task      |
| `update_comment` | Update a comment             |
| `delete_comment` | Delete a comment             |

### Relations

| Tool                  | Description                         |
| --------------------- | ----------------------------------- |
| `create_relation`     | Create a relation between two tasks |
| `delete_relation`     | Delete a relation between tasks     |
| `list_task_relations` | List all relations for a task       |

### Subtasks

| Tool             | Description                            |
| ---------------- | -------------------------------------- |
| `create_subtask` | Create a subtask linked to parent task |
| `list_subtasks`  | List all subtasks for a task           |

### Attachments

| Tool                     | Description                      |
| ------------------------ | -------------------------------- |
| `list_task_attachments`  | List all attachments for a task  |
| `delete_task_attachment` | Delete an attachment from a task |

> See below for complete parameter documentation for all tools.

## Tool Reference

### Parameter Types

- **string**: Text value
- **number**: Numeric value (integer)
- **boolean**: true/false value
- **required**: This parameter must be provided
- **optional**: This parameter can be omitted

> **Note**: All ID parameters (e.g., `projectId`, `taskId`) accept both number and string values. The MCP server uses `z.coerce.number()` to automatically convert string IDs (like "123") to numbers. This means you can pass either `123` or `"123"` for any ID parameter. See [Using String IDs](#using-string-ids) for examples.

### Projects

#### list_projects

List all projects the user has access to.

- **Parameters**: None required
- **Optional**:
  - `page` (number): Page number for pagination
  - `per_page` (number): Number of items per page (default: 25)

#### get_project

Get a specific project by ID.

- **Parameters**:
  - `projectId` (number, required): The project ID

#### create_project

Create a new project.

- **Parameters**:
  - `title` (string, required): The project title
- **Optional**:
  - `description` (string): Project description
  - `hex_color` (string): Hex color code (e.g., "#FF5733")
  - `identifier` (string): Unique identifier for the project
  - `parent_project_id` (number): ID of parent project (for epics/hierarchy)
  - `is_archived` (boolean): Whether the project is archived

#### update_project

Update an existing project.

- **Parameters**:
  - `projectId` (number, required): The project ID
- **Optional**:
  - `title` (string): New title
  - `description` (string): New description
  - `hex_color` (string): New hex color code
  - `identifier` (string): New identifier
  - `parent_project_id` (number): New parent project ID
  - `is_archived` (boolean): Archive status

#### delete_project

Delete a project by ID.

- **Parameters**:
  - `projectId` (number, required): The project ID

#### list_project_children

List child projects under a project.

- **Parameters**:
  - `projectId` (number, required): The parent project ID

#### move_project

Move project to different parent or position.

- **Parameters**:
  - `projectId` (number, required): The project ID
- **Optional**:
  - `parent_project_id` (number): New parent project ID (null to remove from parent)
  - `position` (number): New position in the parent project

### Tasks

#### list_tasks

List all tasks across all projects.

- **Parameters**: None required
- **Optional**:
  - `page` (number): Page number for pagination
  - `per_page` (number): Number of items per page
  - `status` (string): Filter by status (open, done, done_lte, done_gte)
  - `priority` (number): Filter by priority
  - `due_date` (string): Filter by due date
  - `label` (string): Filter by label

#### list_project_tasks

List all tasks for a specific project.

- **Parameters**:
  - `projectId` (number, required): The project ID
- **Optional**:
  - `page` (number): Page number for pagination
  - `per_page` (number): Number of items per page
  - `status` (string): Filter by status
  - `priority` (number): Filter by priority
  - `due_date` (string): Filter by due date

#### get_task

Get a specific task by ID.

- **Parameters**:
  - `taskId` (number, required): The task ID

#### create_task

Create a new task in a project.

- **Parameters**:
  - `projectId` (number, required): The project ID
  - `title` (string, required): The task title
- **Optional**:
  - `description` (string): Task description
  - `priority` (number): Priority (1-5, where 5 is highest)
  - `due_date` (string): Due date (ISO 8601 format)
  - `start_date` (string): Start date
  - `end_date` (string): End date
  - `estimated_time` (string): Estimated time (e.g., "3h")
  - `repeat_after` (number): Repeat after X minutes
  - `hex_color` (string): Task color
  - `is_archived` (boolean): Archive status

#### update_task

Update an existing task.

- **Parameters**:
  - `taskId` (number, required): The task ID
- **Optional**:
  - `title` (string): New title
  - `description` (string): New description
  - `project_id` (number): Move to different project
  - `priority` (number): New priority
  - `due_date` (string): New due date
  - `start_date` (string): New start date
  - `end_date` (string): New end date
  - `estimated_time` (string): New estimated time
  - `repeat_after` (number): New repeat interval
  - `hex_color` (string): New color
  - `is_archived` (boolean): Archive status
  - `percent_done` (number): Progress (0-100)

#### delete_task

Delete a task by ID.

- **Parameters**:
  - `taskId` (number, required): The task ID

### Task State & Movement

#### complete_task

Mark a task as done.

- **Parameters**:
  - `taskId` (number, required): The task ID

#### reopen_task

Reopen a completed task.

- **Parameters**:
  - `taskId` (number, required): The task ID

#### move_task

Move task to different project or position.

- **Parameters**:
  - `taskId` (number, required): The task ID
- **Optional**:
  - `project_id` (number): Target project ID
  - `position` (number): New position

### Assignees

#### add_task_assignee

Add a user as assignee to a task.

- **Parameters**:
  - `taskId` (number, required): The task ID
  - `userId` (number, required): The user ID to add

#### remove_task_assignee

Remove assignee from a task.

- **Parameters**:
  - `taskId` (number, required): The task ID
  - `userId` (number, required): The user ID to remove

#### list_task_assignees

List all assignees for a task.

- **Parameters**:
  - `taskId` (number, required): The task ID

### Labels

#### add_task_label

Add a label to a task.

- **Parameters**:
  - `taskId` (number, required): The task ID
  - `labelId` (number, required): The label ID to add

#### remove_task_label

Remove a label from a task.

- **Parameters**:
  - `taskId` (number, required): The task ID
  - `labelId` (number, required): The label ID to remove

#### list_task_labels

List all labels on a task.

- **Parameters**:
  - `taskId` (number, required): The task ID

#### list_labels

List all available labels (globally).

- **Parameters**: None required
- **Optional**:
  - `page` (number): Page number
  - `per_page` (number): Items per page

### Comments

#### list_comments

List all comments for a task.

- **Parameters**:
  - `taskId` (number, required): The task ID
- **Optional**:
  - `page` (number): Page number
  - `per_page` (number): Items per page

#### create_comment

Add a comment to a task.

- **Parameters**:
  - `taskId` (number, required): The task ID
  - `comment` (string, required): The comment text

#### update_comment

Update a comment.

- **Parameters**:
  - `taskId` (number, required): The task ID
  - `commentId` (number, required): The comment ID
  - `comment` (string, required): New comment text

#### delete_comment

Delete a comment.

- **Parameters**:
  - `taskId` (number, required): The task ID
  - `commentId` (number, required): The comment ID to delete

### Relations

#### create_relation

Create a relation between two tasks.

- **Parameters**:
  - `taskId` (number, required): The source task ID
  - `related_task_id` (number, required): The related task ID
  - `relation_type` (string, required): Relation type (blocks, blockedby, duplicated, duplicatedby, relates, subtask)

#### delete_relation

Delete a relation between tasks.

- **Parameters**:
  - `taskId` (number, required): The source task ID
  - `related_task_id` (number, required): The related task ID

#### list_task_relations

List all relations for a task.

- **Parameters**:
  - `taskId` (number, required): The task ID

### Subtasks

#### create_subtask

Create a subtask linked to parent task.

- **Parameters**:
  - `taskId` (number, required): The parent task ID
  - `title` (string, required): The subtask title
- **Optional**:
  - `description` (string): Subtask description
  - `priority` (number): Priority
  - `due_date` (string): Due date

#### list_subtasks

List all subtasks for a task.

- **Parameters**:
  - `taskId` (number, required): The parent task ID

### Attachments

#### list_task_attachments

List all attachments for a task.

- **Parameters**:
  - `taskId` (number, required): The task ID
- **Optional**:
  - `page` (number): Page number
  - `per_page` (number): Items per page

#### delete_task_attachment

Delete an attachment from a task.

- **Parameters**:
  - `taskId` (number, required): The task ID
  - `attachmentId` (number, required): The attachment ID

## Examples

### Listing Projects and Tasks

```
list my vikunja projects
```

Returns all projects you have access to.

```
list_project_tasks projectId: 1
```

Returns all tasks in project ID 1.

```
list_tasks per_page: 50
```

Lists up to 50 tasks across all projects.

### Creating Projects and Tasks

```
create_project title: "My Project" description: "A new project" hex_color: "#FF5733"
```

Creates a new project with a title, description, and color.

```
create_task projectId: 1 title: "Buy groceries" priority: 3 due_date: "2024-12-25"
```

Creates a task in project ID 1 with priority and due date.

### Managing Task State

```
complete_task taskId: 5
```

Marks task 5 as done.

```
reopen_task taskId: 5
```

Reopens task 5.

### Working with Assignees

```
add_task_assignee taskId: 3 userId: 7
```

Adds user 7 as assignee to task 3.

```
list_task_assignees taskId: 3
```

Lists all assignees for task 3.

### Comments

```
create_comment taskId: 3 comment: "This should be done by Friday"
```

Adds a comment to task 3.

### Relations

```
create_relation taskId: 1 related_task_id: 2 relation_type: "blocks"
```

Creates a "blocks" relation from task 1 to task 2 (task 1 blocks task 2).

### Using String IDs

All ID parameters accept strings, so these are equivalent:

```
get_project projectId: 1
get_project projectId: "1"
```

This is useful when working with data from external sources:

```
list_project_tasks projectId: "123"
```

## Installation

### Prerequisites

- Node.js 18+
- npm or bun
- A Vikunja instance (self-hosted or cloud)
- Vikunja API token

### Getting a Vikunja API Token

1. Log into your Vikunja instance
2. Go to Settings → API Tokens
3. Create a new token

### Build from Source

```bash
git clone https://github.com/Wosh-i/vikunja-mcp.git
cd vikunja-mcp
npm install
npm run build
```

## OpenCode Configuration

### Option 1: Using npx (Recommended)

The easiest way to configure Vikunja MCP is using npx. Add this to your OpenCode config (`~/.config/opencode/opencode.jsonc`):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "vikunja": {
      "type": "local",
      "command": ["npx", "-y", "vikunja-mcp"],
      "environment": {
        "VIKUNJA_URL": "https://your-vikunja-instance.com/api/v1",
        "VIKUNJA_TOKEN": "your-api-token-here",
      },
    },
  },
}
```

Using npx with `-y` skips the confirmation prompt and automatically downloads the package.

### Option 2: Build from Source

If you prefer to run locally without npx, build from source:

```bash
git clone https://github.com/Wosh-i/vikunja-mcp.git
cd vikunja-mcp
npm install
npm run build
```

Then configure OpenCode:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "vikunja": {
      "type": "local",
      "command": ["node", "/path/to/vikunja-mcp/dist/index.js"],
      "environment": {
        "VIKUNJA_URL": "https://your-vikunja-instance.com/api/v1",
        "VIKUNJA_TOKEN": "your-api-token-here",
      },
    },
  },
}
```

### Configuration Options

| Option          | Required | Default                       | Description               |
| --------------- | -------- | ----------------------------- | ------------------------- |
| `VIKUNJA_URL`   | No       | https://try.vikunja.io/api/v1 | Your Vikunja API base URL |
| `VIKUNJA_TOKEN` | Yes      | -                             | Your Vikunja API token    |

### Environment Variables

You can also set environment variables globally in your shell:

```bash
export VIKUNJA_URL="https://your-vikunja-instance.com/api/v1"
export VIKUNJA_TOKEN="your-api-token-here"
```

Then the OpenCode config can be simpler:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "vikunja": {
      "type": "local",
      "command": ["node", "/path/to/vikunja-mcp/dist/index.js"],
    },
  },
}
```

## Usage

### CLI Options

| Option    | Alias | Description               |
| --------- | ----- | ------------------------- |
| `--token` | `-t`  | Your Vikunja API token    |
| `--url`   | `-u`  | Your Vikunja API base URL |
| `--help`  | `-h`  | Show help                 |

### Using with OpenCode

After configuration, you can use Vikunja tools in OpenCode:

```
list my vikunja projects
```

```
create a project called "My Tasks" with color #FF5733
```

```
add a task titled "Buy groceries" to project "My Tasks" with priority 3
```

```
show me all tasks in the Inbox project
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev

# Run tests (when available)
npm test
```

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions welcome! Please open an issue or pull request.
