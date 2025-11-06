# RAGE:MP TypeScript Boilerplate

A modern TypeScript framework for RAGE:MP multiplayer servers with built-in services, authentication, and database integration.

## ✨ Features

- **Full TypeScript Support** - Complete type definitions for client, server, and CEF
- **Service Architecture** - Pre-built services for events, authentication, vehicles, and more
- **Database Integration** - MySQL support with TypeORM entities
- **Modern UI** - React-based UI with Vite bundling
- **Fast Build** - SWC compiler for lightning-fast transpilation
- **Hot Reload** - Development mode with automatic rebuilding

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
```

## 🛠️ Available Scripts

- `pnpm run build` - Build the project
- `pnpm run watch` - Watch mode for development
- `pnpm run dev` - Run with nodemon
- `pnpm run build:ui` - Build UI separately

## 📦 Built With

- TypeScript
- Rollup + SWC
- MySQL2
- React + Vite
- bcryptjs for authentication

## � License

MIT License - see [LICENSE](LICENSE) for details.
