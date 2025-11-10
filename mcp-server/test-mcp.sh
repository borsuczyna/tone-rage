#!/bin/bash

# Simple test script to verify the MCP server can start

echo "Testing MCP Server..."
echo ""

# Try to start the server and capture stderr
OUTPUT=$(timeout 1 node dist/index.js 2>&1)

# Check if we got the expected startup message
if echo "$OUTPUT" | grep -q "tone-rage MCP Server running on stdio"; then
    echo "✅ MCP Server started successfully"
    echo "✅ Server is ready to accept MCP connections"
    exit 0
else
    echo "❌ MCP Server failed to start"
    echo "Output: $OUTPUT"
    exit 1
fi
