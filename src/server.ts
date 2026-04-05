import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { VikunjaApiClient, VikunjaApiError } from "./client.js";
import { tools, ToolDefinition } from "./tools/index.js";

export class MCPServer {
  private server: Server;
  private client: VikunjaApiClient;

  constructor(client: VikunjaApiClient) {
    this.client = client;
    this.server = new Server(
      { name: "vikunja-mcp", version: "1.0.0" },
      { capabilities: { tools: {} } },
    );
    this.setupToolHandlers();
    this.setupToolListing();
  }

  private setupToolListing() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      try {
        const toolsList = tools.map((tool) => {
          const schema = tool.jsonSchema?.inputSchema;
          if (!schema) {
            return {
              name: tool.name,
              description: tool.description,
              inputSchema: { type: "object", properties: {}, required: [] },
            };
          }
          return {
            name: tool.name,
            description: tool.description,
            inputSchema: schema,
          };
        });

        return { tools: toolsList };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `ListTools error: ${message}` }],
          isError: true,
        };
      }
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request: CallToolRequest) => {
        const toolName = request.params.name;
        const args = request.params.arguments || {};

        const tool = tools.find((t) => t.name === toolName);
        if (!tool) {
          return {
            content: [{ type: "text", text: `Tool not found: ${toolName}` }],
            isError: true,
          };
        }

        try {
          if (!this.client.hasToken()) {
            return {
              content: [
                {
                  type: "text",
                  text: "Error: VIKUNJA_TOKEN not configured. Set the environment variable in OpenCode config.",
                },
              ],
              isError: true,
            };
          }
          return await tool.handler(this.client, args);
        } catch (error) {
          if (error instanceof VikunjaApiError) {
            return {
              content: [
                { type: "text", text: `Vikunja API Error: ${error.message}` },
              ],
              isError: true,
            };
          }
          if (error instanceof z.ZodError) {
            return {
              content: [
                { type: "text", text: `Validation Error: ${error.message}` },
              ],
              isError: true,
            };
          }
          const message =
            error instanceof Error ? error.message : String(error);
          return {
            content: [{ type: "text", text: `Error: ${message}` }],
            isError: true,
          };
        }
      },
    );
  }

  getServer(): Server {
    return this.server;
  }
}
