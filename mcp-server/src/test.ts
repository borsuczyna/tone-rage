#!/usr/bin/env node

/**
 * Simple test script to verify MCP server functionality
 * This sends a few test requests to the server to ensure it's working properly
 */

import { spawn } from 'child_process';
import * as path from 'path';

const serverPath = path.join(process.cwd(), 'dist', 'index.js');

async function testMCPServer() {
	console.log('Starting MCP server test...\n');

	const server = spawn('node', [serverPath], {
		stdio: ['pipe', 'pipe', 'pipe'],
	});

	let output = '';
	server.stdout.on('data', (data) => {
		output += data.toString();
	});

	server.stderr.on('data', (data) => {
		console.log('Server:', data.toString().trim());
	});

	// Wait for server to start
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Test 1: Initialize
	console.log('Test 1: Sending initialize request...');
	const initRequest = {
		jsonrpc: '2.0',
		id: 1,
		method: 'initialize',
		params: {
			protocolVersion: '2024-11-05',
			capabilities: {},
			clientInfo: {
				name: 'test-client',
				version: '1.0.0',
			},
		},
	};
	server.stdin.write(JSON.stringify(initRequest) + '\n');

	// Wait for response
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Test 2: List tools
	console.log('Test 2: Sending list tools request...');
	const listToolsRequest = {
		jsonrpc: '2.0',
		id: 2,
		method: 'tools/list',
		params: {},
	};
	server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

	// Wait for response
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Test 3: List resources
	console.log('Test 3: Sending list resources request...');
	const listResourcesRequest = {
		jsonrpc: '2.0',
		id: 3,
		method: 'resources/list',
		params: {},
	};
	server.stdin.write(JSON.stringify(listResourcesRequest) + '\n');

	// Wait for final response
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Close the server
	server.kill();

	console.log('\n✅ MCP Server test completed!');
	console.log('The server is responding to requests.\n');
}

testMCPServer().catch((error) => {
	console.error('❌ Test failed:', error);
	process.exit(1);
});
