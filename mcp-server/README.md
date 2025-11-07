# Tone-Rage MCP Server

A Model Context Protocol (MCP) server for the tone-rage RAGE:MP project. This server allows AI assistants and other MCP clients to interact with the project's codebase.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). This server exposes the tone-rage project's structure, files, and functionality as standardized tools and resources that can be used by AI assistants.

## Features

### Tools

The server provides the following tools:

1. **read_project_file** - Read any file from the project
   - Input: `path` (relative path to file)
   - Example: `"src/server/index.ts"`

2. **list_directory** - List contents of any directory
   - Input: `path` (relative path to directory)
   - Example: `"src/server/Services"`

3. **search_files** - Search for files by name pattern
   - Input: `pattern` (search string), optional `directory`
   - Example: `pattern: "Service"` finds all service files

4. **get_project_structure** - Get an overview of the project structure
   - No input required
   - Returns organized directory structure and descriptions

5. **get_server_services** - List all server services
   - No input required
   - Returns all available services in the project

### Resources

The server exposes these resources:

- `tone-rage://project/readme` - Project README documentation
- `tone-rage://project/package` - Package.json configuration
- `tone-rage://server/index` - Server entry point

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Usage

### With Claude Desktop

Add this to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "tone-rage": {
      "command": "node",
      "args": ["/path/to/tone-rage/mcp-server/dist/index.js"],
      "cwd": "/path/to/tone-rage/mcp-server"
    }
  }
}
```

### With Other MCP Clients

The server uses stdio transport and can be connected to any MCP client:

```bash
node dist/index.js
```

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

## Project Structure

```
mcp-server/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript output
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Example Interactions

Once connected, you can ask AI assistants things like:

- "Show me the server's main entry point"
- "List all services in the server directory"
- "Search for files related to authentication"
- "What's the project structure?"
- "Read the EventService implementation"

The MCP server will use the appropriate tools to fulfill these requests.

## License

MIT - Same as the parent tone-rage project
