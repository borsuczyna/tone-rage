# ElementDataService Usage Guide

A comprehensive guide with practical examples for using the ElementDataService in your RageMP TypeScript project.

## Table of Contents

1. [Basic Concepts](#basic-concepts)
2. [Server Usage](#server-usage)
3. [Client Usage](#client-usage)
4. [Common Patterns](#common-patterns)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Basic Concepts

### What is Element Data?

Element data is custom information attached to game elements (players, vehicles). Think of it as a flexible key-value storage system where you can store any data and control who can see it.

### Share Modes Explained

**Server Modes:**
- **ServerOnly**: Data exists only on server (secure, hidden from clients)
- **Everywhere**: Everyone sees it (public data)
- **SpecificClient**: Only one client sees it (private to that player)

**Client Modes:**
- **ClientOnly**: Stays on client (UI state, local preferences)
- **ClientToServer**: Client sends to server (needs permission)
- **ClientToAll**: Client sends to everyone via server (needs permission)

## Server Usage

### 1. Setting Element Data

```typescript
import ElementDataService from './Services/ElementDataService';
import { ShareMode } from '@shared/Models/ElementDataModels';

// Example: Player joins, set initial data
mp.events.add('playerJoin', (player: PlayerMp) => {
    // Public data - everyone sees it
    ElementDataService.setElementData(player, 'name', player.name, ShareMode.Everywhere);
    ElementDataService.setElementData(player, 'level', 1, ShareMode.Everywhere);
    
    // Private data - only this player sees it
    ElementDataService.setElementData(
        player,
        'money',
        1000,
        ShareMode.SpecificClient
    );
    
    // Server-only data - nobody else sees it
    ElementDataService.setElementData(player, 'adminLevel', 0, ShareMode.ServerOnly);
    ElementDataService.setElementData(player, 'lastLogin', Date.now(), ShareMode.ServerOnly);
});
```

### 2. Getting Element Data

```typescript
// Simple get
const level = ElementDataService.getElementData(player, 'level');
const money = ElementDataService.getElementData(player, 'money');

// Check if data exists
const adminLevel = ElementDataService.getElementData(player, 'adminLevel');
if (adminLevel !== undefined && adminLevel > 0) {
    // Player is admin
}

// Get all data for debugging
const allData = ElementDataService.getAllElementData(player);
console.log(`Player ${player.name} has ${allData.size} data entries`);
```

### 3. Configuring Client Permissions

```typescript
import { ClientWritePermission } from '@shared/Models/ElementDataModels';

// Allow clients to update their score (syncs to everyone)
ElementDataService.setClientWritePermission('score', ClientWritePermission.AllClients);

// Allow clients to update health (server sees it, but doesn't broadcast)
ElementDataService.setClientWritePermission('health', ClientWritePermission.ServerOnly);

// Block clients from changing admin level (default behavior)
ElementDataService.setClientWritePermission('adminLevel', ClientWritePermission.None);
```

### 4. Vehicle Data

```typescript
// When player enters vehicle
mp.events.add('playerEnterVehicle', (player: PlayerMp, vehicle: VehicleMp) => {
    // Set owner (everyone can see)
    ElementDataService.setElementData(vehicle, 'owner', player.name, ShareMode.Everywhere);
    
    // Set fuel (everyone can see)
    ElementDataService.setElementData(vehicle, 'fuel', 100, ShareMode.Everywhere);
    
    // Set locked state (server only, prevents client manipulation)
    ElementDataService.setElementData(vehicle, 'isLocked', false, ShareMode.ServerOnly);
});

// Update fuel over time
setInterval(() => {
    mp.vehicles.forEach((vehicle) => {
        if (vehicle.engine) {
            const currentFuel = ElementDataService.getElementData(vehicle, 'fuel') || 100;
            const newFuel = Math.max(0, currentFuel - 0.1);
            ElementDataService.setElementData(vehicle, 'fuel', newFuel, ShareMode.Everywhere);
        }
    });
}, 1000);
```

## Client Usage

### 1. Setting Local Data

```typescript
import ElementDataService from './Services/ElementDataService';
import { ShareMode } from '@shared/Models/ElementDataModels';

// Store UI preferences locally
ElementDataService.setElementData(
    mp.players.local.remoteId,
    'player',
    'uiSettings',
    { hudVisible: true, mapZoom: 2 },
    ShareMode.ClientOnly
);

// Get it back instantly
const uiSettings = ElementDataService.getElementData(
    mp.players.local.remoteId,
    'uiSettings'
);
```

### 2. Syncing to Server

```typescript
// Send data to server (requires permission on server)
ElementDataService.setElementData(
    mp.players.local.remoteId,
    'player',
    'score',
    100,
    ShareMode.ClientToServer
);

// Send data to all clients via server (requires permission)
ElementDataService.setElementData(
    mp.players.local.remoteId,
    'player',
    'status',
    'ready',
    ShareMode.ClientToAll
);
```

### 3. Getting Data from Server

```typescript
// Get from local cache (instant)
const level = ElementDataService.getElementData(
    mp.players.local.remoteId,
    'level'
);

// Request from server (async with callback)
ElementDataService.getElementDataFromServer(
    mp.players.local.remoteId,
    'player',
    'money',
    (money) => {
        mp.console.logInfo(`I have $${money}`);
    }
);
```

### 4. Displaying Other Players' Data

```typescript
// Assuming data was synced via ShareMode.Everywhere
mp.players.forEach((player) => {
    if (player !== mp.players.local) {
        const level = ElementDataService.getElementData(player.remoteId, 'level');
        const name = ElementDataService.getElementData(player.remoteId, 'name');
        
        // Display name tag with level
        // (your name tag rendering code here)
    }
});
```

## Common Patterns

### Pattern 1: Player Stats System

```typescript
// Server-side
class PlayerStats {
    static init() {
        // Configure permissions
        ElementDataService.setClientWritePermission('kills', ClientWritePermission.None);
        
        mp.events.add('playerJoin', (player: PlayerMp) => {
            // Load from database (example)
            const stats = Database.loadPlayerStats(player);
            
            // Public stats (everyone sees)
            ElementDataService.setElementData(player, 'level', stats.level, ShareMode.Everywhere);
            ElementDataService.setElementData(player, 'kills', stats.kills, ShareMode.Everywhere);
            
            // Private stats (only this player)
            ElementDataService.setElementData(
                player,
                'experience',
                stats.experience,
                ShareMode.SpecificClient
            );
            ElementDataService.setElementData(
                player,
                'money',
                stats.money,
                ShareMode.SpecificClient
            );
        });
    }
    
    static addKill(player: PlayerMp) {
        const kills = ElementDataService.getElementData(player, 'kills') || 0;
        ElementDataService.setElementData(player, 'kills', kills + 1, ShareMode.Everywhere);
    }
}
```

### Pattern 2: Vehicle Ownership System

```typescript
// Server-side
class VehicleOwnership {
    static claimVehicle(player: PlayerMp, vehicle: VehicleMp) {
        // Check if already owned
        const currentOwner = ElementDataService.getElementData(vehicle, 'owner');
        if (currentOwner) {
            player.outputChatBox('Vehicle already owned!');
            return false;
        }
        
        // Set ownership (everyone can see)
        ElementDataService.setElementData(vehicle, 'owner', player.name, ShareMode.Everywhere);
        ElementDataService.setElementData(vehicle, 'ownerId', player.id, ShareMode.Everywhere);
        
        // Set private key (server only, for security)
        const vehicleKey = this.generateKey();
        ElementDataService.setElementData(vehicle, 'key', vehicleKey, ShareMode.ServerOnly);
        
        player.outputChatBox('Vehicle claimed!');
        return true;
    }
    
    static canAccessVehicle(player: PlayerMp, vehicle: VehicleMp): boolean {
        const ownerId = ElementDataService.getElementData(vehicle, 'ownerId');
        return ownerId === player.id || player.dimension === 1; // admin dimension
    }
    
    private static generateKey(): string {
        return Math.random().toString(36).substring(2, 15);
    }
}
```

### Pattern 3: Team System

```typescript
// Server-side
class TeamSystem {
    static assignTeam(player: PlayerMp, team: string) {
        // Set team (everyone sees it for friend/foe identification)
        ElementDataService.setElementData(player, 'team', team, ShareMode.Everywhere);
        
        // Set team color
        const color = team === 'red' ? [255, 0, 0] : [0, 0, 255];
        ElementDataService.setElementData(player, 'teamColor', color, ShareMode.Everywhere);
        
        player.outputChatBox(`You joined team ${team}!`);
    }
    
    static getTeammates(player: PlayerMp): PlayerMp[] {
        const myTeam = ElementDataService.getElementData(player, 'team');
        if (!myTeam) return [];
        
        return mp.players.toArray().filter(p => {
            const team = ElementDataService.getElementData(p, 'team');
            return team === myTeam && p !== player;
        });
    }
}

// Client-side: Show teammate markers
setInterval(() => {
    const myTeam = ElementDataService.getElementData(mp.players.local.remoteId, 'team');
    
    mp.players.forEach((player) => {
        if (player === mp.players.local) return;
        
        const playerTeam = ElementDataService.getElementData(player.remoteId, 'team');
        if (playerTeam === myTeam) {
            // Draw teammate marker
            // (your marker rendering code)
        }
    });
}, 100);
```

### Pattern 4: Quest System

```typescript
// Server-side
class QuestSystem {
    static assignQuest(player: PlayerMp, questId: string) {
        // Quest data is private to the player
        const quest = this.getQuestById(questId);
        
        ElementDataService.setElementData(
            player,
            `quest_${questId}`,
            {
                id: questId,
                progress: 0,
                objectives: quest.objectives,
                startTime: Date.now()
            },
            ShareMode.SpecificClient
        );
    }
    
    static updateProgress(player: PlayerMp, questId: string, progress: number) {
        const quest = ElementDataService.getElementData(player, `quest_${questId}`);
        if (!quest) return;
        
        quest.progress = progress;
        ElementDataService.setElementData(
            player,
            `quest_${questId}`,
            quest,
            ShareMode.SpecificClient
        );
        
        // Check completion
        if (progress >= 100) {
            this.completeQuest(player, questId);
        }
    }
    
    private static getQuestById(questId: string) {
        // Return quest data
        return { objectives: [] };
    }
    
    private static completeQuest(player: PlayerMp, questId: string) {
        player.outputChatBox(`Quest ${questId} completed!`);
        // Give rewards, etc.
    }
}
```

## Best Practices

### 1. Choose the Right ShareMode

```typescript
// ❌ BAD: Sending sensitive data to clients
ElementDataService.setElementData(player, 'password', hash, ShareMode.Everywhere);

// ✅ GOOD: Keep sensitive data on server
ElementDataService.setElementData(player, 'password', hash, ShareMode.ServerOnly);

// ❌ BAD: Using Everywhere for data only one player needs
ElementDataService.setElementData(player, 'money', 1000, ShareMode.Everywhere);

// ✅ GOOD: Use SpecificClient for private data
ElementDataService.setElementData(player, 'money', 1000, ShareMode.SpecificClient);
```

### 2. Configure Permissions Properly

```typescript
// ❌ BAD: Allowing clients to write critical data
ElementDataService.setClientWritePermission('adminLevel', ClientWritePermission.AllClients);

// ✅ GOOD: Block critical data from client writes
ElementDataService.setClientWritePermission('adminLevel', ClientWritePermission.None);

// ✅ GOOD: Allow harmless client writes
ElementDataService.setClientWritePermission('chatMessage', ClientWritePermission.ServerOnly);
```

### 3. Use Meaningful Key Names

```typescript
// ❌ BAD: Unclear key names
ElementDataService.setElementData(player, 'x', 100, ShareMode.Everywhere);
ElementDataService.setElementData(player, 'data1', value, ShareMode.ServerOnly);

// ✅ GOOD: Clear, descriptive names
ElementDataService.setElementData(player, 'experience', 100, ShareMode.Everywhere);
ElementDataService.setElementData(player, 'lastLoginTimestamp', Date.now(), ShareMode.ServerOnly);
```

### 4. Check for Undefined

```typescript
// ❌ BAD: Assuming data exists
const level = ElementDataService.getElementData(player, 'level');
const newLevel = level + 1; // Crashes if undefined

// ✅ GOOD: Check for undefined
const level = ElementDataService.getElementData(player, 'level') || 1;
const newLevel = level + 1;

// ✅ EVEN BETTER: Explicit check
const level = ElementDataService.getElementData(player, 'level');
if (level !== undefined) {
    const newLevel = level + 1;
    // ...
}
```

### 5. Clean Up When Done

```typescript
// Client-side: Clean up when element is destroyed
mp.events.add('entityStreamOut', (entity: EntityMp) => {
    if (entity.type === 'vehicle') {
        ElementDataService.clearElementData(entity.remoteId);
    }
});
```

## Troubleshooting

### Data Not Syncing to Client

**Problem:** You set data with `ShareMode.Everywhere` but client doesn't see it.

**Solutions:**
1. Make sure ElementDataService is initialized on both server and client
2. Check that the client joined after the data was set (joining players get all data automatically)
3. Verify the data was actually set by checking server logs

### Client Cannot Set Data

**Problem:** Client tries to set data but nothing happens.

**Solutions:**
1. Configure client write permission on server: `ElementDataService.setClientWritePermission('key', ClientWritePermission.AllClients)`
2. Make sure the key name matches exactly
3. Check server logs for permission denied warnings

### Data Disappears After Player Disconnects

**Problem:** Element data is lost when player leaves.

**Solutions:**
1. This is by design - element data is temporary
2. Save important data to database before player disconnects
3. Use the `playerQuit` event to persist data:

```typescript
mp.events.add('playerQuit', (player: PlayerMp) => {
    const level = ElementDataService.getElementData(player, 'level');
    const money = ElementDataService.getElementData(player, 'money');
    
    Database.savePlayerData(player, { level, money });
});
```

### Performance Issues with Large Data

**Problem:** Game lags when setting large objects.

**Solutions:**
1. Avoid storing huge objects as element data
2. Store only necessary data, keep large data in database
3. Use ServerOnly mode for large data that clients don't need

```typescript
// ❌ BAD: Storing huge inventory
ElementDataService.setElementData(player, 'inventory', hugeInventoryArray, ShareMode.Everywhere);

// ✅ GOOD: Store in database, only sync what's needed
Database.saveInventory(player, hugeInventoryArray);
ElementDataService.setElementData(player, 'inventoryCount', 50, ShareMode.Everywhere);
```

## Conclusion

ElementDataService provides a flexible and powerful way to manage game data. By following these patterns and best practices, you can build robust systems for player stats, vehicles, teams, quests, and more while maintaining security and performance.
