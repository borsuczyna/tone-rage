# ElementDataService Implementation

## Overview

ElementDataService provides a flexible and powerful system for managing element data (player and vehicle data) with fine-grained control over data sharing between server and clients. It supports multiple sharing modes, client write permissions, and automatic synchronization.

## Problem Solved

RageMP's native element data system is limited and doesn't provide flexible control over how data is shared between server and clients. This implementation solves that by offering:

- **Flexible Sharing Modes**: Control exactly where data is stored and synced
- **Client Write Permissions**: Configure which data keys clients can modify
- **Automatic Synchronization**: Data automatically syncs to clients when players join
- **Type Safety**: Strongly typed with TypeScript enums and interfaces

## Key Features

- ✅ **Multiple Share Modes**: Server-only, everywhere, specific client, client-only, client-to-server, client-to-all
- ✅ **Client Write Permissions**: Configure per-key permissions for client writes
- ✅ **Automatic Sync on Join**: New players automatically receive all relevant element data
- ✅ **Bidirectional**: Works for both server→client and client→server data flow
- ✅ **Type Safe**: Full TypeScript support with enums and interfaces
- ✅ **Supports Multiple Elements**: Works with both PlayerMp and VehicleMp
- ✅ **Event-Based**: Uses EventService for reliable data transfer
- ✅ **Memory Efficient**: Automatic cleanup when players disconnect

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Shared Components                        │
│  - ElementDataModels.ts (ShareMode, permissions, types)    │
└─────────────────────────────────────────────────────────────┘
           │                                   │
           ▼                                   ▼
┌──────────────────────┐          ┌──────────────────────┐
│ Server ElementData   │          │  Client ElementData  │
│      Service         │◄────────►│      Service         │
│                      │          │                      │
│  - setElementData()  │          │  - setElementData()  │
│  - getElementData()  │          │  - getElementData()  │
│  - setClientWrite    │          │  - getFromServer()   │
│    Permission()      │          │  - Local storage     │
│  - Auto sync on join │          │                      │
└──────────────────────┘          └──────────────────────┘
```

## Share Modes

### Server-Side Share Modes

When setting element data on the server, you can choose from:

1. **ShareMode.ServerOnly** (default)
   - Data stays on server only
   - Not synced to any clients
   - Use for sensitive data (passwords, internal flags, etc.)

2. **ShareMode.Everywhere**
   - Data synced to all clients and server
   - All players can see this data
   - Use for public data (player names, levels, scores, etc.)

3. **ShareMode.SpecificClient**
   - Data synced only to the specific client (if element is PlayerMp)
   - Use for player-specific private data (personal stats, private messages, etc.)

### Client-Side Share Modes

When setting element data on the client, you can choose from:

1. **ShareMode.ClientOnly** (default)
   - Data stays on client only
   - Not synced to server
   - Use for UI state, preferences, etc.

2. **ShareMode.ClientToServer**
   - Data synced to server only (requires permission)
   - Use for client actions that server needs to validate

3. **ShareMode.ClientToAll**
   - Data synced to server and all clients (requires permission)
   - Use for client actions that should be visible to everyone

## Client Write Permissions

Configure which element data keys clients can write to:

```typescript
// Allow clients to write 'score' and sync to all clients
ElementDataService.setClientWritePermission('score', ClientWritePermission.AllClients);

// Allow clients to write 'health' but only sync to server
ElementDataService.setClientWritePermission('health', ClientWritePermission.ServerOnly);

// Prevent clients from writing 'adminLevel'
ElementDataService.setClientWritePermission('adminLevel', ClientWritePermission.None);
```

**ClientWritePermission Values:**
- `ServerOnly`: Client can write, data syncs to server only
- `AllClients`: Client can write, data syncs to all clients
- `None`: Client cannot write this key (default)

## API Reference

### Server-Side API

```typescript
import ElementDataService from './Services/ElementDataService';
import { ShareMode, ClientWritePermission } from '@shared/Models/ElementDataModels';

// Initialize (called automatically in server index.ts)
ElementDataService.init();

// Set element data
ElementDataService.setElementData(
    player,              // PlayerMp or VehicleMp
    'level',             // key: string
    42,                  // value: any
    ShareMode.Everywhere // shareMode (optional, default: ServerOnly)
);

// Get element data
const level = ElementDataService.getElementData(player, 'level');

// Get all element data for an element
const allData = ElementDataService.getAllElementData(player);

// Configure client write permissions
ElementDataService.setClientWritePermission('score', ClientWritePermission.AllClients);
```

### Client-Side API

```typescript
import ElementDataService from './Services/ElementDataService';
import { ShareMode } from '@shared/Models/ElementDataModels';

// Initialize (called automatically in client index.ts)
ElementDataService.init();

// Set element data locally
ElementDataService.setElementData(
    elementId,           // number (element ID)
    'player',            // elementType: 'player' | 'vehicle'
    'localSetting',      // key: string
    'value',             // value: any
    ShareMode.ClientOnly // shareMode (optional, default: ClientOnly)
);

// Get element data from local storage
const value = ElementDataService.getElementData(elementId, 'localSetting');

// Get element data from server (async with callback)
ElementDataService.getElementDataFromServer(
    elementId,
    'player',
    'level',
    (value) => {
        mp.console.logInfo(`Level: ${value}`);
    }
);

// Get all element data for an element
const allData = ElementDataService.getAllElementData(elementId);

// Clear element data (useful when element is destroyed)
ElementDataService.clearElementData(elementId);
```

## Usage Examples

### Example 1: Basic Player Data

```typescript
// Server-side: Set player level (visible to everyone)
mp.events.addCommand('setlevel', (player: PlayerMp, fullText: string) => {
    const level = parseInt(fullText);
    ElementDataService.setElementData(player, 'level', level, ShareMode.Everywhere);
    player.outputChatBox(`Your level is now ${level}`);
});

// Client-side: Read player level
const level = ElementDataService.getElementData(mp.players.local.remoteId, 'level');
mp.console.logInfo(`My level: ${level}`);
```

### Example 2: Private Player Data

```typescript
// Server-side: Set private data (only visible to specific player)
ElementDataService.setElementData(
    player,
    'privateMessage',
    'This is a secret message',
    ShareMode.SpecificClient
);

// This data is automatically synced to the client
```

### Example 3: Vehicle Data

```typescript
// Server-side: Set vehicle data
if (player.vehicle) {
    ElementDataService.setElementData(
        player.vehicle,
        'owner',
        player.name,
        ShareMode.Everywhere
    );
    
    ElementDataService.setElementData(
        player.vehicle,
        'fuel',
        75,
        ShareMode.Everywhere
    );
    
    // Engine health is server-only (prevents client manipulation)
    ElementDataService.setElementData(
        player.vehicle,
        'engineHealth',
        1000,
        ShareMode.ServerOnly
    );
}
```

### Example 4: Client-Initiated Data

```typescript
// Server-side: Configure permission
ElementDataService.setClientWritePermission('customData', ClientWritePermission.AllClients);

// Client-side: Set data that syncs to all clients
ElementDataService.setElementData(
    mp.players.local.remoteId,
    'player',
    'customData',
    { status: 'ready', color: 'blue' },
    ShareMode.ClientToAll
);
```

### Example 5: Complete Player Stats System

```typescript
// Server-side setup
ElementDataService.setClientWritePermission('score', ClientWritePermission.AllClients);
ElementDataService.setClientWritePermission('kills', ClientWritePermission.ServerOnly);

mp.events.add('playerJoin', (player: PlayerMp) => {
    // Set initial stats (synced to all)
    ElementDataService.setElementData(player, 'level', 1, ShareMode.Everywhere);
    ElementDataService.setElementData(player, 'score', 0, ShareMode.Everywhere);
    
    // Set admin level (server only, hidden from clients)
    ElementDataService.setElementData(player, 'adminLevel', 0, ShareMode.ServerOnly);
    
    // Set private data (only this player sees it)
    ElementDataService.setElementData(
        player,
        'privateStats',
        { playtime: 0, deaths: 0 },
        ShareMode.SpecificClient
    );
});
```

## Testing

Comprehensive test commands are available:

### Server Commands

1. **`/testdata`** - Test element data with different share modes
   - Sets server-only, everywhere, and specific client data
   - Displays all data back to the player

2. **`/testvehicledata`** - Test vehicle element data
   - Must be in a vehicle to use
   - Sets owner, fuel, and engine health data

3. **`/getalldata`** - Display all element data for the player
   - Shows all keys, values, and share modes

### Client Tests

The client automatically runs tests on startup:
- Test local data storage
- Test sync to server
- Test sync to all clients

Check the client console for test results.

## Automatic Synchronization

When a player joins the server:

1. Server checks all existing element data
2. For each element (player, vehicle):
   - Data with `ShareMode.Everywhere` is synced to the new player
   - Data with `ShareMode.SpecificClient` is synced if the element is the joining player
3. Client receives all data via EventService
4. Client stores data locally for instant access

## Memory Management

- **Player Disconnect**: All element data for the player is automatically cleaned up
- **Element Destroy**: Use `ElementDataService.clearElementData(elementId)` on client to clean up
- **Data Storage**: Uses Map for O(1) access time
- **No Memory Leaks**: Automatic cleanup prevents memory buildup

## Security Considerations

1. **Client Write Permissions**: 
   - By default, clients CANNOT write any data
   - Must explicitly configure permissions per key
   - Server validates all client write attempts

2. **Server-Only Data**:
   - `ShareMode.ServerOnly` data never leaves the server
   - Perfect for sensitive data like passwords, internal flags

3. **Validation**:
   - Server checks element existence before setting data
   - Invalid client requests are logged and ignored

4. **Anticheat Integration**:
   - Uses EventService which includes hash verification
   - Protected against tampering

## Performance

- **Local Access**: `getElementData()` is O(1) - instant access
- **Network**: Only syncs when needed based on ShareMode
- **Memory**: Efficient Map-based storage
- **Scalability**: Handles hundreds of players with thousands of data entries

## Backward Compatibility

- Does not interfere with RageMP's native element data system
- Can coexist with custom data implementations
- No breaking changes to existing code

## Future Enhancements

Possible improvements:
- Data change callbacks/events
- Data persistence to database
- Data validation/schemas
- Data compression for large objects
- Time-to-live (TTL) for temporary data
- Element data queries/filters

## Files Structure

### New Files
- `src/shared/Models/ElementDataModels.ts` - Shared types and enums
- `src/server/Services/ElementDataService.ts` - Server implementation
- `src/client/Services/ElementDataService.ts` - Client implementation
- `src/server/Tests/ElementDataServiceTest.ts` - Server tests
- `src/client/Tests/ElementDataServiceTest.ts` - Client tests
- `ELEMENTDATASERVICE_IMPLEMENTATION.md` - This documentation

### Modified Files
- `src/server/index.ts` - Initialize ElementDataService
- `src/client/index.ts` - Initialize ElementDataService

## Conclusion

ElementDataService provides a production-ready, flexible, and powerful system for managing element data in RageMP. It offers fine-grained control over data sharing, strong security through permissions, and automatic synchronization, making it ideal for complex multiplayer game mechanics.

## Quick Start

```typescript
// Server: Set public data
ElementDataService.setElementData(player, 'level', 10, ShareMode.Everywhere);

// Server: Set private data
ElementDataService.setElementData(player, 'secret', 'x', ShareMode.ServerOnly);

// Server: Configure client permissions
ElementDataService.setClientWritePermission('score', ClientWritePermission.AllClients);

// Client: Get data
const level = ElementDataService.getElementData(playerId, 'level');

// Client: Set data (if permission configured)
ElementDataService.setElementData(
    playerId,
    'player',
    'score',
    100,
    ShareMode.ClientToAll
);
```
