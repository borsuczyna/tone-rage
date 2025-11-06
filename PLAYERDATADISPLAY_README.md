# Player Data Display Service

A debug feature that displays all element data above players in 3D text.

## Usage

### Enable/Disable Display

Use the following command in-game to toggle the display:

```
/toggledatadisplay
```

When enabled, all element data for every player in stream range will be displayed as 3D text above their heads.

### Testing

To test the feature with sample data, enable the test module in `src/client/index.ts`:

1. Uncomment the import:
```typescript
import PlayerDataDisplayServiceTest from './Tests/PlayerDataDisplayServiceTest';
```

2. Uncomment the initialization:
```typescript
PlayerDataDisplayServiceTest.init();
```

3. Use the following commands in-game:
   - `/testdatadisplay` - Sets sample element data for your player
   - `/toggledatadisplay` - Toggles the 3D display on/off
   - `/cleartestdata` - Shows info about clearing test data

## Implementation Details

### Service: `PlayerDataDisplayService`

- **Location**: `src/client/Services/PlayerDataDisplayService.ts`
- **Features**:
  - Hooks into the `render` event to display 3D text every frame
  - Uses `ElementDataService.getAll()` to retrieve all element data
  - Formats data as `key: value` pairs with line breaks
  - Displays text above player heads with configurable offset
  - Toggle on/off via command for debug purposes

### Data Format

The service displays element data in the following format:
```
key1: value1
key2: value2
key3: {"nested": "object"}
```

Objects and arrays are automatically serialized to JSON for display.

### Rendering

- **Text Position**: 1.0 units above player's head (Z-axis offset)
- **Font**: Font 4 (monospace-style)
- **Color**: White (255, 255, 255, 255)
- **Scale**: 0.35 x 0.35
- **Outline**: Enabled for better visibility
- **Center**: Text is centered above the player

## Technical Notes

- The service is disabled by default to avoid performance impact
- Only renders for players within stream range
- Skips invalid players and players with no element data
- Zero performance impact when disabled (early return in render handler)

## Example Element Data

```typescript
ElementDataService.set(playerId, 'player', 'level', 10, ShareMode.Everywhere);
ElementDataService.set(playerId, 'player', 'score', 1234, ShareMode.Everywhere);
ElementDataService.set(playerId, 'player', 'team', 'red', ShareMode.Everywhere);
```

Results in display:
```
level: 10
score: 1234
team: red
```
