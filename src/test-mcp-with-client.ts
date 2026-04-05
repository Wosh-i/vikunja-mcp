import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { VikunjaApiClient } from "./client.js";

const baseUrl = process.env.VIKUNJA_URL || "https://try.vikunja.io/api/v1";
const token = process.env.VIKUNJA_TOKEN || "";

// Create client even if token is empty - we'll check in tools
const client = new VikunjaApiClient(baseUrl, token);

async function main() {
  const server = new Server(
    { name: "test-mcp-with-client", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "list_projects",
          description: "List all projects",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        },
      ],
    };
  });

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      const toolName = request.params.name;

      // Check if token is available
      if (!token) {
        return {
          content: [
            {
              type: "text",
              text: "Error: VIKUNJA_TOKEN not configured. Set the environment variable.",
            },
          ],
          isError: true,
        };
      }

      if (toolName === "list_projects") {
        try {
          const result = await client.get<unknown[]>("/projects");
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          return {
            content: [{ type: "text", text: `Error: ${message}` }],
            isError: true,
          };
        }
      }

      return {
        content: [{ type: "text", text: `Unknown tool: ${toolName}` }],
        isError: true,
      };
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
