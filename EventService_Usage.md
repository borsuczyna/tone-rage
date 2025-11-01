# EventService Usage Guide

## Overview

The EventService now supports sending large data between client and server with automatic chunking. Data is automatically split into 32KB chunks when needed, allowing you to send data of any size.

## Server-Side API

### Register Event Handlers

```typescript
import EventService from './Services/EventService';

// Register a handler for events from clients
EventService.registerEventHandler('playerData', (client: PlayerMp, ...args: any[]) => {
    console.log('Received data from client:', client.name, args);
    
    // You can send large data back to the client
    const largeData = {
        inventory: [/* thousands of items */],
        statistics: {/* complex object */}
    };
    
    EventService.triggerClientEvent(client, 'updateInventory', largeData);
});
```

### Send Events to Client

```typescript
import EventService from './Services/EventService';

// Send data to a specific client (automatically chunked if needed)
EventService.triggerClientEvent(client, 'eventName', arg1, arg2, arg3);

// Example with large data
const hugeDataset = {
    vehicles: [/* array with 10000+ vehicles */],
    properties: [/* array with 5000+ properties */]
};

EventService.triggerClientEvent(client, 'loadWorldData', hugeDataset);
```

## Client-Side API

### Initialize (already done in index.ts)

The EventService is automatically initialized in `src/client/index.ts`.

### Register Event Handlers

```typescript
import EventService from './Services/EventService';

// Register a handler for events from server
EventService.registerEventHandler('updateInventory', (data: any) => {
    console.log('Received inventory data:', data);
    // Update UI or process the data
});

EventService.registerEventHandler('loadWorldData', (worldData: any) => {
    console.log('Received world data:', worldData);
    // Load vehicles, properties, etc.
});
```

### Send Events to Server

```typescript
import EventService from './Services/EventService';

// Send data to server (automatically chunked if needed)
EventService.triggerServerEvent('playerData', arg1, arg2, arg3);

// Example with large data
const playerSession = {
    actions: [/* array with thousands of player actions */],
    locations: [/* visited locations */],
    achievements: [/* complex achievement data */]
};

EventService.triggerServerEvent('saveSession', playerSession);
```

## Backward Compatibility

The original methods are still available:

### Server-Side
- `EventService.registerListener(eventName, callback)` - Same as `registerEventHandler`

### Client-Side
- `EventService.triggerEvent(eventName, ...args)` - Sends to server but without chunking support

## Technical Details

- **Chunk Size**: 32KB (32000 bytes) per chunk
- **Automatic**: Chunking happens automatically when encoded data exceeds 32KB
- **Transparent**: You don't need to handle chunks manually - just send and receive data normally
- **Size Limit**: No practical size limit - can send gigabytes of data (though not recommended)
- **Encoding**: Data is JSON stringified and encoded before chunking
- **Hash Verification**: All events include anticheat hash verification on the server side

## Example: Sending Large Player Inventory

```typescript
// Server sends inventory to client
const playerInventory = {
    items: Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `Description for item ${i}`,
        properties: { weight: Math.random() * 100, value: Math.random() * 1000 }
    }))
};

EventService.triggerClientEvent(player, 'loadInventory', playerInventory);

// Client receives and processes
EventService.registerEventHandler('loadInventory', (inventory: any) => {
    console.log(`Received ${inventory.items.length} items`);
    // Display inventory in UI
});
```

## Testing

A test implementation is included in the codebase:

**Server Test**: `src/server/Tests/EventServiceTest.ts`
**Client Test**: `src/client/Tests/EventServiceTest.ts`

To test large data transfer:
1. Start the server and connect a client
2. Run the command `/testlarge` in the game
3. The server will send a large dataset (~10,000 items) to the client
4. The client will receive it and send back ~3,000 items to the server
5. The server will respond with ~5,000 items back to the client
6. Check the console/chat for confirmation messages

## Notes

1. Large data transfers will take multiple network calls (one per chunk)
2. The system ensures all chunks are received before firing the event handler
3. Each client has its own chunk assembler on the server side
4. Chunks are identified by a unique ID to prevent mixing data from different events
5. Missing chunks will throw an error to prevent data corruption
