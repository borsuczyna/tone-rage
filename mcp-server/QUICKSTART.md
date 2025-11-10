# MCP Server Quick Start

Get the tone-rage MCP server running in 3 steps:

## 1. Build the Server

```bash
cd mcp-server
npm install
npm run build
```

## 2. Configure Your AI Assistant

### For Claude Desktop:

Find your config file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

Add this (replace with your actual path):

```json
{
  "mcpServers": {
    "tone-rage": {
      "command": "node",
      "args": ["/absolute/path/to/tone-rage/mcp-server/dist/index.js"],
      "cwd": "/absolute/path/to/tone-rage/mcp-server"
    }
  }
}
```

## 3. Restart and Test

1. Restart Claude Desktop
2. Look for the MCP server indicator
3. Try asking: "What's the structure of the tone-rage project?"

## Verify Installation

Test the server manually:

```bash
npm test
```

You should see:
```
✅ MCP Server started successfully
✅ Server is ready to accept MCP connections
```

## Next Steps

- Read [USAGE.md](USAGE.md) for example queries
- See [README.md](README.md) for detailed documentation
- Check `claude_desktop_config.json.example` for config template

## Troubleshooting

**Server won't start:**
- Make sure you ran `npm install` and `npm run build`
- Check that Node.js is installed (`node --version`)

**AI assistant can't connect:**
- Verify the paths in your config are absolute (not relative)
- Make sure the server was built successfully
- Restart your AI assistant after config changes

**Need help?**
- Check the main [README.md](README.md)
- Review the [USAGE.md](USAGE.md) guide
