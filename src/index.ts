import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { VikunjaApiClient } from "./client.js";
import { MCPServer } from "./server.js";

const baseUrl = process.env.VIKUNJA_URL || "https://try.vikunja.io/api/v1";
const token = process.env.VIKUNJA_TOKEN || "";

const client = new VikunjaApiClient(baseUrl, token);
const server = new MCPServer(client);

async function main() {
  const transport = new StdioServerTransport();
  await server.getServer().connect(transport);
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
