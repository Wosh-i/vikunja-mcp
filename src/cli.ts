import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./index.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function showHelp() {
  console.log(`vikunja-mcp - Model Context Protocol server for Vikunja API

Usage: vikunja-mcp [options]

Options:
  --help              Show this help message and exit
  --version           Show version number and exit
  --url <url>         Vikunja API URL (env: VIKUNJA_URL)
  --token <token>     Vikunja API token (env: VIKUNJA_TOKEN)

Environment:
  VIKUNJA_URL         Default API URL (default: https://try.vikunja.io/api/v1)
  VIKUNJA_TOKEN       API token for authentication (required)`);
}

function showVersion() {
  const pkg = JSON.parse(
    readFileSync(join(__dirname, "..", "package.json"), "utf-8"),
  );
  console.log(pkg.version);
}

function parseArgs(argv: string[]): {
  url?: string;
  token?: string;
  showHelp?: boolean;
  showVersion?: boolean;
} {
  const result: {
    url?: string;
    token?: string;
    showHelp?: boolean;
    showVersion?: boolean;
  } = {};

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--help":
        result.showHelp = true;
        break;
      case "--version":
        result.showVersion = true;
        break;
      case "--url":
        if (i + 1 < argv.length) {
          result.url = argv[++i];
        } else {
          console.error("Error: --url requires a value");
          process.exit(1);
        }
        break;
      case "--token":
        if (i + 1 < argv.length) {
          result.token = argv[++i];
        } else {
          console.error("Error: --token requires a value");
          process.exit(1);
        }
        break;
      default:
        console.error(`Error: Unknown option: ${arg}`);
        process.exit(1);
    }
  }

  return result;
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.showHelp) {
    showHelp();
    process.exit(0);
  }

  if (args.showVersion) {
    showVersion();
    process.exit(0);
  }

  const url =
    args.url || process.env.VIKUNJA_URL || "https://try.vikunja.io/api/v1";
  const token = args.token || process.env.VIKUNJA_TOKEN;

  if (!token) {
    console.error("Error: Vikunja API token is required.");
    console.error(
      "Provide it via --token argument or VIKUNJA_TOKEN environment variable.",
    );
    process.exit(1);
  }

  const server = createServer(url, token);
  const transport = new StdioServerTransport();
  await server.getServer().connect(transport);
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
