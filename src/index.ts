import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { VikunjaApiClient } from "./client.js";
import { MCPServer } from "./server.js";

export function createServer(url: string, token: string): MCPServer {
  const client = new VikunjaApiClient(url, token);
  return new MCPServer(client);
}

export async function main() {
  const baseUrl = process.env.VIKUNJA_URL || "https://try.vikunja.io/api/v1";
  const token = process.env.VIKUNJA_TOKEN || "";

  if (!token) {
    console.error("Error: VIKUNJA_TOKEN environment variable is required.");
    process.exit(1);
  }

  const server = createServer(baseUrl, token);
  const transport = new StdioServerTransport();
  await server.getServer().connect(transport);
}

// Only run if this module is the main entry point
const isMain = process.argv[1]?.endsWith("index.js");
if (isMain) {
  main().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
