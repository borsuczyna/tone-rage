#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	ListResourcesRequestSchema,
	ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * MCP Server for tone-rage RAGE:MP project
 * Provides tools to interact with the game server codebase
 */

// Resolve the project root directory relative to this script's location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Helper function to read files safely
async function readFile(filePath: string): Promise<string> {
	const fullPath = path.join(PROJECT_ROOT, filePath);
	return await fs.readFile(fullPath, 'utf-8');
}

// Helper function to list directory contents
async function listDirectory(dirPath: string): Promise<Array<{ name: string; type: string }>> {
	const fullPath = path.join(PROJECT_ROOT, dirPath);
	const entries = await fs.readdir(fullPath, { withFileTypes: true });
	return entries.map((entry) => ({
		name: entry.name,
		type: entry.isDirectory() ? 'directory' : 'file',
	}));
}

// Helper function to search for files
async function searchFiles(pattern: string, directory: string = ''): Promise<string[]> {
	const fullPath = path.join(PROJECT_ROOT, directory);
	const results: string[] = [];

	async function walk(dir: string) {
		const entries = await fs.readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			const fullEntryPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist') {
					await walk(fullEntryPath);
				}
			} else {
				if (entry.name.includes(pattern)) {
					results.push(path.relative(PROJECT_ROOT, fullEntryPath));
				}
			}
		}
	}

	await walk(fullPath);
	return results;
}

// Create server instance
const server = new Server(
	{
		name: 'tone-rage-mcp-server',
		version: '1.0.0',
	},
	{
		capabilities: {
			tools: {},
			resources: {},
		},
	}
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			{
				name: 'read_project_file',
				description: 'Read a file from the tone-rage project',
				inputSchema: {
					type: 'object',
					properties: {
						path: {
							type: 'string',
							description: 'Relative path to the file (e.g., "src/server/index.ts")',
						},
					},
					required: ['path'],
				},
			},
			{
				name: 'list_directory',
				description: 'List contents of a directory in the tone-rage project',
				inputSchema: {
					type: 'object',
					properties: {
						path: {
							type: 'string',
							description: 'Relative path to the directory (e.g., "src/server")',
						},
					},
					required: ['path'],
				},
			},
			{
				name: 'search_files',
				description: 'Search for files by name pattern in the tone-rage project',
				inputSchema: {
					type: 'object',
					properties: {
						pattern: {
							type: 'string',
							description: 'Search pattern (e.g., "Service" to find all service files)',
						},
						directory: {
							type: 'string',
							description: 'Optional directory to search in (defaults to entire project)',
						},
					},
					required: ['pattern'],
				},
			},
			{
				name: 'get_project_structure',
				description: 'Get an overview of the tone-rage project structure',
				inputSchema: {
					type: 'object',
					properties: {},
				},
			},
			{
				name: 'get_server_services',
				description: 'List all server services available in the project',
				inputSchema: {
					type: 'object',
					properties: {},
				},
			},
		],
	};
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;

	try {
		if (!args) {
			throw new Error('Missing arguments');
		}

		switch (name) {
			case 'read_project_file': {
				const content = await readFile(args.path as string);
				return {
					content: [
						{
							type: 'text',
							text: content,
						},
					],
				};
			}

			case 'list_directory': {
				const entries = await listDirectory(args.path as string);
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(entries, null, 2),
						},
					],
				};
			}

			case 'search_files': {
				const results = await searchFiles(args.pattern as string, (args.directory as string) || '');
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(results, null, 2),
						},
					],
				};
			}

			case 'get_project_structure': {
				const structure = {
					root: PROJECT_ROOT,
					directories: {
						'src/server': 'Server-side logic, database, and services',
						'src/client': 'Client-side scripts',
						'src/shared': 'Shared utilities and models',
						ui: 'React-based user interface',
						scripts: 'Build and deployment scripts',
					},
					mainFiles: {
						'package.json': 'Project dependencies and scripts',
						'tsconfig.base.json': 'TypeScript configuration',
						'README.md': 'Project documentation',
					},
				};
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(structure, null, 2),
						},
					],
				};
			}

			case 'get_server_services': {
				const servicesPath = 'src/server/Services';
				const serviceFiles = await listDirectory(servicesPath);
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(serviceFiles, null, 2),
						},
					],
				};
			}

			default:
				throw new Error(`Unknown tool: ${name}`);
		}
	} catch (error: any) {
		return {
			content: [
				{
					type: 'text',
					text: `Error: ${error.message}`,
				},
			],
			isError: true,
		};
	}
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
	return {
		resources: [
			{
				uri: 'tone-rage://project/readme',
				mimeType: 'text/markdown',
				name: 'Project README',
				description: 'Main project documentation',
			},
			{
				uri: 'tone-rage://project/package',
				mimeType: 'application/json',
				name: 'Package Configuration',
				description: 'Project package.json',
			},
			{
				uri: 'tone-rage://server/index',
				mimeType: 'text/typescript',
				name: 'Server Entry Point',
				description: 'Main server initialization file',
			},
		],
	};
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
	const { uri } = request.params;

	try {
		let content: string;
		let mimeType: string;

		switch (uri) {
			case 'tone-rage://project/readme':
				content = await readFile('README.md');
				mimeType = 'text/markdown';
				break;

			case 'tone-rage://project/package':
				content = await readFile('package.json');
				mimeType = 'application/json';
				break;

			case 'tone-rage://server/index':
				content = await readFile('src/server/index.ts');
				mimeType = 'text/typescript';
				break;

			default:
				throw new Error(`Unknown resource: ${uri}`);
		}

		return {
			contents: [
				{
					uri,
					mimeType,
					text: content,
				},
			],
		};
	} catch (error: any) {
		throw new Error(`Failed to read resource ${uri}: ${error.message}`);
	}
});

// Start the server
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error('tone-rage MCP Server running on stdio');
}

main().catch((error) => {
	console.error('Server error:', error);
	process.exit(1);
});
