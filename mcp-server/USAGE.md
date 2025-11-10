# MCP Server Usage Guide

This guide explains how to use the tone-rage MCP server with AI assistants.

## What Can You Do?

Once the MCP server is connected to your AI assistant (like Claude Desktop), you can interact with the tone-rage project in natural language. The server provides tools and resources that help the AI understand and work with the codebase.

## Example Queries

Here are some example questions you can ask when the MCP server is connected:

### Project Structure
- "What is the structure of this project?"
- "Show me the project's main directories"
- "What files are in the server directory?"

### Reading Files
- "Show me the main server entry point"
- "Read the EventService implementation"
- "What's in the package.json file?"

### Searching
- "Find all TypeScript files related to authentication"
- "Search for files containing 'Service' in their name"
- "List all services available in the server"

### Understanding the Code
- "How does the authentication service work?"
- "What database entities are defined?"
- "Explain the vehicle service implementation"

## Available Tools

The MCP server provides these tools that the AI can use:

### 1. read_project_file
Reads any file from the project.

**Example usage by AI:**
```
User: "Show me the main server file"
AI uses: read_project_file with path "src/server/index.ts"
```

### 2. list_directory
Lists contents of any directory.

**Example usage by AI:**
```
User: "What services are available?"
AI uses: list_directory with path "src/server/Services"
```

### 3. search_files
Searches for files matching a pattern.

**Example usage by AI:**
```
User: "Find all entity files"
AI uses: search_files with pattern "Entity"
```

### 4. get_project_structure
Returns an overview of the project structure.

**Example usage by AI:**
```
User: "Explain this project's organization"
AI uses: get_project_structure
```

### 5. get_server_services
Lists all available server services.

**Example usage by AI:**
```
User: "What server services exist?"
AI uses: get_server_services
```

## Available Resources

The MCP server also exposes these resources that can be referenced:

- `tone-rage://project/readme` - Project README
- `tone-rage://project/package` - package.json configuration
- `tone-rage://server/index` - Server entry point

## Tips for Best Results

1. **Be specific**: Instead of "show me the code", say "show me the authentication service code"
2. **Ask follow-up questions**: The AI maintains context, so you can ask related questions
3. **Request explanations**: Ask "explain how X works" to get detailed insights
4. **Combine queries**: "List all services and explain what the EventService does"

## Troubleshooting

If the MCP server isn't working:

1. Verify it's built: `npm run build` in the mcp-server directory
2. Check the path in your MCP client configuration is absolute and correct
3. Restart your AI assistant (e.g., Claude Desktop)
4. Check the logs/console for error messages

## Security Note

The MCP server only provides **read access** to the project files. It cannot modify files, execute code, or perform write operations. This makes it safe to use for exploring and understanding the codebase.
