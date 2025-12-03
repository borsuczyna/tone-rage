# Command Snippets Feature - Visual Guide

## Feature Demonstration

### 1. Initial State - Typing "/" Shows All Commands

When a user types "/" in the chat input, a dropdown appears above the input showing all available commands with their parameters:

```
┌─────────────────────────────────────────────────┐
│ /pm                                             │
│ [player:player] [id:number] [message:rest]      │
│ Send a private message to a player              │
├─────────────────────────────────────────────────┤
│ /me                                             │
│ [action:rest]                                   │
│ Describe an action                              │
├─────────────────────────────────────────────────┤
│ /do                                             │
│ [description:rest]                              │
│ Describe a situation                            │
├─────────────────────────────────────────────────┤
│ /b                                              │
│ [message:rest]                                  │
│ Out of character chat                           │
├─────────────────────────────────────────────────┤
│ /help                                           │
│ (no parameters)                                 │
│ Get help with commands                          │
├─────────────────────────────────────────────────┤
│ /give                                           │
│ [player_id:number] [item:string] [amount:number]│
│ Give an item to a player                        │
└─────────────────────────────────────────────────┘
```

**Visual Features:**
- Dark semi-transparent background matching chat theme
- Each command shows name, parameters, and description
- Parameters are color-coded by type (green=number, blue=player, yellow=string, purple=rest)
- Smooth slide-up animation when appearing

### 2. Filtered Commands - Typing "/pm"

When typing a specific command like "/pm", only matching commands are shown:

```
┌─────────────────────────────────────────────────┐
│ /pm                                             │
│ [player:player] [id:number] [message:rest]      │
│ Send a private message to a player              │
└─────────────────────────────────────────────────┘
Input: /pm
```

### 3. Valid Parameters - "/pm Player 123 Hello"

When all parameters are valid, they display normally with their type colors:

```
┌─────────────────────────────────────────────────┐
│ /pm                                             │
│ [player:player] [id:number] [message:rest]      │
│ Send a private message to a player              │
└─────────────────────────────────────────────────┘
Input: /pm Player 123 Hello
```

**Parameter States:**
- `player` - Normal blue border (player type)
- `id` - Normal green border (number type) ✓ "123" is valid
- `message` - Normal purple border (rest type) ✓ "Hello" is valid

### 4. Invalid Parameters - "/pm Player abc"

When a parameter is invalid (e.g., "abc" instead of a number), it's highlighted in RED:

```
┌─────────────────────────────────────────────────┐
│ /pm                                             │
│ [player:player] [id:number⚠️RED] [message:rest]  │
│ Send a private message to a player              │
└─────────────────────────────────────────────────┘
Input: /pm Player abc
```

**Visual Feedback:**
- Invalid parameter has RED border and RED text
- Red background highlight (rgba(244, 67, 54, 0.15))
- Shake animation plays to draw attention
- Parameter type text also turns red

### 5. Multiple Invalid Parameters - "/give abc sword xyz"

```
┌─────────────────────────────────────────────────┐
│ /give                                           │
│ [player_id:number⚠️RED] [item:string] [amount:number]│
│ Give an item to a player                        │
└─────────────────────────────────────────────────┘
Input: /give abc sword xyz
```

**Visual Feedback:**
- First invalid parameter (`abc`) is highlighted in RED
- Validation stops at first error (showing earliest problem)
- User must fix first error before seeing next validation

## Color Coding Reference

### Parameter Types
- 🟢 **number** (Green: #4CAF50) - Numeric values only
- 🔵 **player** (Blue: #2196F3) - Player name or ID
- 🟡 **string** (Yellow: #FFC107) - Any text value
- 🟣 **rest** (Purple: #9C27B0) - Remaining text

### Validation States
- ✅ **Valid** - Normal type color with standard border
- ⚠️ **Invalid** - RED (#f44336) with red background and shake animation
- 💡 **Current** - White glow effect showing active parameter

## Animations

### Slide Up (On Show)
```css
@keyframes slideUp {
    from { opacity: 0; transform: translateY(0.5rem); }
    to { opacity: 1; transform: translateY(0); }
}
```
Duration: 0.2s ease-out

### Shake (On Invalid)
```css
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
}
```
Duration: 0.3s ease

## Styling Details

- **Background**: rgba(25, 25, 25, 0.95) with backdrop-filter blur
- **Border**: 1px solid rgba(80, 80, 80, 0.5)
- **Border Radius**: 0.5rem (matches chat input)
- **Padding**: 0.5rem container, 0.75rem per command
- **Font Size**: 1.1rem for command name, 0.85rem for parameters
- **Max Height**: 20rem with scrollbar
- **Shadow**: 0 4px 12px rgba(0, 0, 0, 0.5)

## Integration Points

The command snippets feature integrates seamlessly with:
- Chat input field (appears above it)
- Chat settings (respects zoom level via CSS variables)
- Chat visibility (hidden when chat is closed)
- Emoji picker (both can be open simultaneously)

## User Experience Flow

1. User presses "T" to open chat
2. User types "/" - all commands appear
3. User types command name - filtered list appears
4. User types space - exact command selected, parameters shown
5. User types parameters - real-time validation occurs
6. Invalid parameters highlighted immediately in red
7. User corrects invalid parameters - red highlight disappears
8. User presses Enter - command is sent (validation is client-side only)
