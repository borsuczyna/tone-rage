# Command Snippets Feature Documentation

## Overview
This feature adds command autocomplete with parameter type validation to the chat interface. When users type "/" in the chat, they see available commands with their parameters. The system validates parameter types in real-time and highlights invalid inputs in red.

## Features

### 1. Command Autocomplete
- Type "/" to see all available commands
- Type "/pm" or any partial command to filter the list
- Commands show their parameters with type information

### 2. Parameter Type Validation
The system supports four parameter types:

- **`number`** (Green) - Only numeric values (e.g., 123, 456)
- **`player`** (Blue) - Player name or ID
- **`string`** (Yellow) - Any text value
- **`rest`** (Purple) - Remaining text (must be last parameter)

### 3. Real-time Validation
- Valid parameters are displayed normally
- Invalid parameters are highlighted in RED with a shake animation
- Current parameter being typed is highlighted with a glow effect

## Registered Commands

### `/pm Player id:number message:rest`
Send a private message to a player
- `player` (player type) - Player name
- `id` (number type) - Player ID
- `message` (rest type) - Message content

**Examples:**
- ✅ Valid: `/pm Player 123 Hello there!`
- ❌ Invalid: `/pm Player abc Hello` (abc is not a number)

### `/me action:rest`
Describe an action
- `action` (rest type) - Action description

**Example:** `/me waves at everyone`

### `/do description:rest`
Describe a situation
- `description` (rest type) - Situation description

### `/b message:rest`
Out of character chat
- `message` (rest type) - OOC message

### `/help`
Get help with commands (no parameters)

### `/give player_id:number item:string amount:number`
Give an item to a player
- `player_id` (number type) - Target player ID
- `item` (string type) - Item name
- `amount` (number type) - Quantity

**Examples:**
- ✅ Valid: `/give 5 sword 10`
- ❌ Invalid: `/give abc sword 10` (abc is not a number)

## Technical Implementation

### Files Created/Modified

1. **`src/shared/Models/CommandSnippet.ts`** - Core type definitions and validation logic
2. **`src/client/Services/CommandSnippetService.ts`** - Client-side command registration service
3. **`ui/src/Interface/Interfaces/Components/Chat/CommandSnippets.tsx`** - React component for displaying snippets
4. **`ui/src/Interface/Interfaces/Components/Chat/ChatInput.tsx`** - Updated to integrate command snippets
5. **`ui/src/Interface/Interfaces/ChatInterface.tsx`** - Updated to pass snippets to input
6. **`ui/src/Interface/Interfaces/Styles/ChatInterface.module.css`** - Added styling for snippets
7. **`src/client/Features/Chat/Chat.ts`** - Registers default commands on init

### Adding New Commands

To add new commands, modify `src/client/Features/Chat/Chat.ts`:

```typescript
CommandSnippetService.registerSnippets([
    {
        command: 'mycommand',
        description: 'Description of my command',
        parameters: [
            { name: 'param1', type: 'number' },
            { name: 'param2', type: 'string' },
            { name: 'text', type: 'rest' }
        ]
    }
]);
```

## Styling

The feature uses the same dark theme as the rest of the chat interface:
- Semi-transparent dark backgrounds with backdrop blur
- Color-coded parameter types for easy identification
- Smooth animations (slide-up on show, shake on invalid)
- Consistent with chat input styling (rounded corners, shadows)

## How It Works

1. **User Types "/"**: The ChatInput component detects "/" and shows all registered commands
2. **Filtering**: As the user continues typing, commands are filtered by prefix match
3. **Exact Match**: When an exact command is found, parameters are displayed
4. **Validation**: As user types parameters, each is validated against its type
5. **Visual Feedback**: Invalid parameters are highlighted in red with shake animation
6. **Current Parameter**: The parameter being typed is highlighted with a glow effect

## Browser Compatibility

The feature uses modern CSS features:
- CSS Custom Properties (variables)
- Backdrop filters
- CSS animations
- Flexbox

All features are supported in modern browsers (Chrome 76+, Firefox 70+, Safari 13+).
