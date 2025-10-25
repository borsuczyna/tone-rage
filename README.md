<p align="center" style="font-size: 26px">
	<b>A Typescript Boilerplate for RAGE:MP with simple setup and usage.</b>
</p>

<br>

Remember to 🌟 this Github if you 💖 it.

> For Javascript Edition, see: [ragemp-javascript](https://github.com/leonardssh/ragemp-javascript)

## 📌 Features

-   Full RAGE:MP Type Support for VSCode
-   Built in rollup config for transpile and auto-copy (incredibly fast using the [SWC](https://github.com/swc-project/swc))
-   Prettier Configuration for code formatting.
-   **HMAC-SHA256 Signature Verification** - Secure fetch operations with cryptographic signatures
-   **Timeout Handling** - Automatic timeout (10s) for fetch requests to prevent stale promises

## 🔐 Security Features

### HMAC Signature Verification

The fetch system includes HMAC-SHA256 signature verification to ensure response integrity:

-   Server signs all fetch responses using HMAC-SHA256
-   Client verifies signatures before accepting responses
-   Prevents tampering with server responses
-   Configurable secret keys via environment variables

#### Configuration

**Server-side (.env):**
```bash
# Dedicated HMAC secret key (recommended)
HMAC_SECRET_KEY=your_production_secret_here

# Fallback to session secret if HMAC_SECRET_KEY not set
SESSION_SECRET=your_session_secret_here
```

**Client-side (UI):**
Set `VITE_SERVER_HMAC_KEY` environment variable when building the UI:
```bash
cd ui
VITE_SERVER_HMAC_KEY=your_production_secret_here npm run build
```

**Note:** For development, both default to `'dev_secret'`. In production, use strong, unique secrets and consider asymmetric cryptography for enhanced security.

### Fetch Timeout

All fetch requests automatically timeout after 10 seconds, preventing:
-   Memory leaks from stale promises
-   DoS attacks through pending requests
-   UI freezing from unresponsive servers

### Backwards Compatibility

The system maintains backwards compatibility:
-   Unsigned responses are still accepted (with console warning)
-   Gradually migrate to signed responses without breaking existing code

## 📥 Installation

### Prerequisites

-   [Install NodeJS 16+](https://nodejs.org/en/download/current/)
-   [Install GIT](https://git-scm.com/downloads)

### Clone the Repository

Use the command below in any terminal, command prompt, etc.

```sh
git clone https://github.com/leonardssh/ragemp-typescript.git
```

### Install the necessary modules

Use the command below in any terminal, command prompt, etc.

```sh
cd ragemp-typescript
npm install
```

### Rename the `.env.example` file to `.env`

Without it, rollup will not be able to copy the files properly

### Compiler Configuration

The boilerplate comes with 2 compilers:

1. [SWC](https://swc.rs/) - ⚡ultra fast (no support for const enums)
2. [Typescript](https://www.npmjs.com/package/rollup-plugin-typescript2) - 🐢 very slow (support for const enums)

> To use SWC, set `COMPILER_USE_SWC` to true, and for `TYPESCRIPT` to false

```bash
PRODUCTION_MODE=false
COMPILER_USE_SWC=true // <--- CHANGE THE COMPILER BETWEEN SWC & TYPESCRIPT
```

### Build the server

Use the command below in any terminal, command prompt, etc. This will transpile and copy the files to the `dist` folder. Folder which is used for production.

```sh
npm run build
```

![](https://i.imgur.com/p6hbXmg.png)

### Get Server Files

Grab the server files from `RAGEMP/server-files` and drop them in the `dist` folder.

### Start the Server

```sh
cd ./dist
./ragemp-server.exe
```

## 👨‍💻 Contributing

To contribute to this repository, feel free to create a new fork of the repository and submit a pull request.

1. Fork / Clone and select the `main` branch.
2. Create a new branch in your fork.
3. Make your changes.
4. Commit your changes, and push them.
5. Submit a Pull Request [here](https://github.com/LeonardSSH/ragemp-typescript/pulls)!

## 📋 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
