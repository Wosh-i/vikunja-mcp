# Vikunja MCP Server

A Model Context Protocol server for managing Vikunja projects and tasks.

## Features

- Full CRUD operations for projects
- Full CRUD operations for tasks
- Task comments management
- Task relations (subtasks, blocking, etc.)
- Task attachments listing

## Available Tools

### Projects

| Tool             | Description                              |
| ---------------- | ---------------------------------------- |
| `list_projects`  | List all projects the user has access to |
| `get_project`    | Get a specific project by ID             |
| `create_project` | Create a new project                     |
| `update_project` | Update an existing project               |
| `delete_project` | Delete a project by ID                   |

### Tasks

| Tool                 | Description                           |
| -------------------- | ------------------------------------- |
| `list_tasks`         | List all tasks across all projects    |
| `list_project_tasks` | List all tasks for a specific project |
| `get_task`           | Get a specific task by ID             |
| `create_task`        | Create a new task in a project        |
| `update_task`        | Update an existing task               |
| `delete_task`        | Delete a task by ID                   |

### Comments

| Tool             | Description                  |
| ---------------- | ---------------------------- |
| `list_comments`  | List all comments for a task |
| `create_comment` | Add a comment to a task      |
| `update_comment` | Update a comment             |
| `delete_comment` | Delete a comment             |

### Relations

| Tool              | Description                         |
| ----------------- | ----------------------------------- |
| `create_relation` | Create a relation between two tasks |
| `delete_relation` | Delete a relation between tasks     |

### Attachments

| Tool               | Description                     |
| ------------------ | ------------------------------- |
| `list_attachments` | List all attachments for a task |

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
git clone https://github.com/YOUR_USERNAME/vikunja-mcp.git
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
