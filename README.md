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
├── client/
│   ├── Features/      # Feature modules (HUD, Auth, Spawn, Scoreboard, etc.)
│   ├── Services/      # Infrastructure services (Events, Interface, Keyboard, etc.)
│   └── Tests/         # Client-side tests
├── server/
│   ├── Features/      # Business logic modules (Auth, User, Vehicle, Money, etc.)
│   ├── Services/      # Infrastructure services (Events, Fetch, ElementData, etc.)
│   ├── Database/      # Database configuration and entities
│   ├── Utils/         # Server utilities
│   └── Tests/         # Server-side tests
├── shared/            # Shared code between client and server
│   ├── Models/        # Data models and types
│   ├── Services/      # Shared services
│   └── Translation/   # Localization
ui/                    # React-based user interface
```

### Architecture

The project follows a clear separation of concerns:

- **Services**: Infrastructure-level code (event handling, data fetching, element data management)
- **Features**: Business logic organized by domain (authentication, spawning, vehicles, money)
- **Shared**: Code that is used by both client and server
- **UI**: React-based interface components (kept separate from game logic)

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
