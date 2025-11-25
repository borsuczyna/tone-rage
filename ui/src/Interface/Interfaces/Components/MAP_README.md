# Map Component

A fully interactive, responsive map component for displaying game maps with zoom, pan, and blip (marker) functionality.

## Features

- 🗺️ **Default GTA 5 Map**: Comes with a placeholder for GTA 5 grayscale map
- 🖼️ **Custom Images**: Support for any custom map image
- 🔍 **Zoom Controls**: Mouse wheel zoom in/out with configurable limits
- 🖱️ **Pan/Drag**: Click and drag to move around the map
- 📍 **Blips**: Place markers/icons on the map with labels
- 📱 **Responsive**: Automatically fits parent container size
- 🎯 **Boundaries**: Configurable zoom and position limits

## Usage

### Basic Example

```tsx
import Map from './Components/Map';

function MyMapInterface() {
  return (
    <div style={{ width: '800px', height: '600px' }}>
      <Map />
    </div>
  );
}
```

### Full Example with All Options

```tsx
import Map from './Components/Map';

function MyMapInterface() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Map
        // Optional: Use custom map image (default: GTA 5 grayscale map)
        image="/path/to/custom-map.png"
        
        // Optional: Set initial zoom level (default: 1)
        defaultZoom={1.5}
        
        // Optional: Set initial position (default: {x: 0, y: 0})
        defaultPosition={{ x: 100, y: 200 }}
        
        // Optional: Configure boundaries (defaults shown)
        borders={{
          minZoom: 0.5,     // Minimum zoom level
          maxZoom: 5,       // Maximum zoom level
          minX: -3000,      // Minimum X coordinate
          maxX: 3000,       // Maximum X coordinate
          minY: -3000,      // Minimum Y coordinate
          maxY: 3000        // Maximum Y coordinate
        }}
        
        // Optional: Add blips (markers) on the map
        blips={[
          {
            id: 'atm-1',
            position: { x: 500, y: 800 },
            icon: '/images/blips/money.svg',
            label: 'ATM #1'
          },
          {
            id: 'safehouse',
            position: { x: -700, y: 1200 },
            icon: '/images/blips/house.svg',
            label: 'Safehouse'
          }
        ]}
      />
    </div>
  );
}
```

## Props

### `image` (optional)
- **Type**: `string | null`
- **Default**: `'/images/gta5-map-grayscale.svg'`
- **Description**: Path to the map image. Set to `null` to use default GTA 5 map.

### `defaultZoom` (optional)
- **Type**: `number`
- **Default**: `1`
- **Description**: Initial zoom level of the map.

### `defaultPosition` (optional)
- **Type**: `{ x: number, y: number }`
- **Default**: `{ x: 0, y: 0 }`
- **Description**: Initial center position of the map in game coordinates.

### `borders` (optional)
- **Type**: `object`
- **Default**: `{ minZoom: 0.5, maxZoom: 5, minX: -Infinity, maxX: Infinity, minY: -Infinity, maxY: Infinity }`
- **Description**: Boundaries for zoom levels and map coordinates.
  - `minZoom`: Minimum allowed zoom level
  - `maxZoom`: Maximum allowed zoom level
  - `minX`: Minimum X coordinate boundary
  - `maxX`: Maximum X coordinate boundary
  - `minY`: Minimum Y coordinate boundary
  - `maxY`: Maximum Y coordinate boundary

### `blips` (optional)
- **Type**: `Array<{ position: { x: number, y: number }, icon: string, label: string, id?: string | number }>`
- **Default**: `[]`
- **Description**: Array of markers to display on the map.
  - `position`: Game coordinates where the blip should appear
  - `icon`: Path to the blip icon image (SVG or PNG recommended)
  - `label`: Text label shown on hover
  - `id` (optional): Unique identifier for the blip (recommended for better performance)

## Coordinate System

The map uses a coordinate system similar to GTA 5:
- Center of the map is at `(0, 0)`
- Positive X goes to the right
- Positive Y goes up (north)
- Default coordinate range: -3000 to 3000 (configurable via `borders`)

## Styling

The component uses CSS modules for styling. You can customize the appearance by:
1. Modifying `Map.module.css` directly, or
2. Wrapping the Map component in a styled container

## Performance Notes

- The component uses `requestAnimationFrame` for smooth updates
- Image rendering is optimized with `pointer-events: none` on the map image
- Blips scale with zoom for consistent visibility

## Adding Custom Map Images

1. Place your map image in `/ui/public/images/`
2. For GTA 5 map, name it `gta5-map-grayscale.png` to replace the placeholder
3. Or pass any custom image path via the `image` prop

Recommended image specifications:
- Format: PNG or JPG (SVG works but may have scaling issues)
- Size: 2048x2048 or higher for best quality
- Aspect ratio: Square (1:1)

## Browser Compatibility

- Modern browsers with ES2022 support
- Requires support for CSS modules
- Uses React hooks (functional components)
