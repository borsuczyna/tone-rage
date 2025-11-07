# RAGE:MP TypeScript Boilerplate

A modern TypeScript framework for RAGE:MP multiplayer servers with built-in services, authentication, and database integration.

## ✨ Features

- **Full TypeScript Support** - Complete type definitions for client, server, and CEF
- **Service Architecture** - Pre-built services for events, authentication, vehicles, and more
- **Database Integration** - MySQL support with TypeORM entities
- **Modern UI** - React-based UI with Vite bundling
- **Fast Build** - SWC compiler for lightning-fast transpilation
- **Hot Reload** - Development mode with automatic rebuilding
- **MCP Server** - Model Context Protocol server for AI assistant integration

## 🚀 Quick Start

```sh
# Clone the repository
git clone https://github.com/borsuczyna/tone-rage.git
cd tone-rage

# Install dependencies
pnpm install

# Build and run
pnpm run build
```

## 📁 Project Structure

```
src/
├── client/     # Client-side scripts
├── server/     # Server-side logic, database, services
├── shared/     # Shared utilities and models
ui/             # React-based user interface
mcp-server/     # Model Context Protocol server for AI integration
```

## 🛠️ Available Scripts

- `pnpm run build` - Build the project
- `pnpm run watch` - Watch mode for development
- `pnpm run dev` - Run with nodemon
- `pnpm run build:ui` - Build UI separately

## 🤖 MCP Server

The project includes a Model Context Protocol (MCP) server that allows AI assistants to interact with the codebase. See [mcp-server/README.md](mcp-server/README.md) for details.

To set up the MCP server:

```sh
cd mcp-server
npm install
npm run build
```

## 📦 Built With

- TypeScript
- Rollup + SWC
- MySQL2
- React + Vite
- bcryptjs for authentication

## � License

MIT License - see [LICENSE](LICENSE) for details.
