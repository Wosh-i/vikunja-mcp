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

Add the following to your OpenCode config (`~/.config/opencode/opencode.jsonc`):

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
