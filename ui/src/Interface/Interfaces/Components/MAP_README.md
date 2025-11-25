# Map Component

A fully interactive map component with zoom, drag, and blips support. Designed for GTA 5 but can be used with any map image.

## Features

- 🗺️ **Interactive Map**: Displays a map image with zoom and drag capabilities
- 🔍 **Mouse Wheel Zoom**: Scroll to zoom in and out
- 🖱️ **Click & Drag**: Move the map by clicking and dragging
- 📍 **Blips**: Display markers with icons and labels on the map
- 📐 **Responsive**: Uses parent container size
- 🎯 **Customizable Borders**: Set limits for zoom levels and position

## Usage

```tsx
import Map from './Components/Map';

function MyComponent() {
    return (
        <Map
            image={null} // optional, default is GTA 5 grayscale map
            defaultZoom={1} // optional, default is 1
            defaultPosition={{x: 0, y: 0}} // optional, default is {x: 0, y: 0}
            borders={{
                minZoom: 0.5,
                maxZoom: 5,
                minX: -1000,
                maxX: 1000,
                minY: -1000,
                maxY: 1000
            }} // optional
            blips={[
                {position: {x: 100, y: 200}, icon: 'DollarSign', label: 'ATM'},
                {position: {x: -300, y: 400}, icon: 'Home', label: 'Safehouse'}
            ]}
        />
    );
}
```

## Props

### `image` (string | null, optional)
- Path to the map image
- Default: `null` (uses `/maps/gta5-map-grayscale.svg`)
- Can be any image URL or path

### `defaultZoom` (number, optional)
- Initial zoom level
- Default: `1`
- Constrained by `borders.minZoom` and `borders.maxZoom`

### `defaultPosition` (Position, optional)
- Initial position of the map
- Default: `{x: 0, y: 0}`
- Format: `{x: number, y: number}`

### `borders` (Borders, optional)
- Defines limits for zoom and position
- Default: `{minZoom: 0.5, maxZoom: 5, minX: -Infinity, maxX: Infinity, minY: -Infinity, maxY: Infinity}`
- Properties:
  - `minZoom`: Minimum zoom level (default: 0.5)
  - `maxZoom`: Maximum zoom level (default: 5)
  - `minX`: Minimum X position (default: -Infinity)
  - `maxX`: Maximum X position (default: Infinity)
  - `minY`: Minimum Y position (default: -Infinity)
  - `maxY`: Maximum Y position (default: Infinity)

### `blips` (Blip[], optional)
- Array of markers to display on the map
- Default: `[]`
- Format:
```typescript
interface Blip {
    position: {x: number, y: number};
    icon: keyof typeof Icons; // Lucide React icon name
    label: string;
}
```

### `style` (CSSProperties, optional)
- Custom inline styles for the container

### `className` (string, optional)
- Additional CSS classes for the container

## Blip Icons

The component uses [Lucide React](https://lucide.dev/) icons. Common icon names:
- `DollarSign` - Money/ATM
- `Home` - House/Safehouse
- `ShoppingCart` - Store
- `Car` - Garage/Vehicle
- `MapPin` - Generic location marker (default)
- And many more from the Lucide icon set

## Styling

The component uses CSS modules. To customize:
- Modify `Map.module.css` for general styling
- Override with the `className` and `style` props
- The component fills its parent container by default

## Example with Custom Image

```tsx
<Map
    image="/custom-maps/my-city-map.png"
    defaultZoom={1.5}
    defaultPosition={{x: 100, y: -50}}
    borders={{
        minZoom: 0.8,
        maxZoom: 3,
        minX: -500,
        maxX: 500,
        minY: -500,
        maxY: 500
    }}
    blips={[
        {position: {x: 0, y: 0}, icon: 'Flag', label: 'Spawn Point'},
        {position: {x: 200, y: 150}, icon: 'Store', label: 'Shop'}
    ]}
/>
```

## Testing

A test interface is available at `MapTestInterface.tsx`. To enable it for development:
1. Open `src/Hooks/InterfaceVisibilityProvider.tsx`
2. Uncomment `'MapTestInterface': true` in the initial state
3. Run the dev server with `npm run dev`
