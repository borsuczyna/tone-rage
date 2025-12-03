export type CommandParameterType = 'string' | 'number' | 'player' | 'rest';

export interface CommandParameter {
    name: string;
    type: CommandParameterType;
}

export interface CommandSnippet {
    command: string; // e.g., 'pm'
    description?: string;
    parameters: CommandParameter[];
}

export interface ParsedCommandInput {
    command: string;
    args: string[];
    valid: boolean;
    invalidParamIndex?: number; // Index of the first invalid parameter
}

/**
 * Validates if a value matches the expected parameter type
 */
export function validateParameterType(value: string, type: CommandParameterType): boolean {
    switch (type) {
        case 'number':
            return /^\d+$/.test(value);
        case 'player':
            // Player ID (number) or player name (string)
            return value.length > 0;
        case 'string':
            return value.length > 0;
        case 'rest':
            // Rest accepts any remaining text
            return true;
        default:
            return false;
    }
}

/**
 * Parses command input and validates parameter types
 */
export function parseCommandInput(input: string, snippet: CommandSnippet): ParsedCommandInput {
    const trimmed = input.trim();
    
    // Remove leading slash if present
    const withoutSlash = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
    
    // Split by spaces
    const parts = withoutSlash.split(/\s+/);
    const command = parts[0] || '';
    const args = parts.slice(1);
    
    // Check if command matches
    if (command.toLowerCase() !== snippet.command.toLowerCase()) {
        return {
            command,
            args,
            valid: false
        };
    }
    
    // Validate parameters
    let valid = true;
    let invalidParamIndex: number | undefined;
    
    for (let i = 0; i < snippet.parameters.length; i++) {
        const param = snippet.parameters[i];
        
        // For 'rest' type, collect all remaining args
        if (param.type === 'rest') {
            const restValue = args.slice(i).join(' ');
            if (!validateParameterType(restValue, param.type)) {
                valid = false;
                invalidParamIndex = i;
                break;
            }
            break; // 'rest' should be the last parameter
        }
        
        // Check if arg exists
        if (i >= args.length) {
            // Parameter is missing, but that's okay (user might still be typing)
            break;
        }
        
        // Validate the argument
        if (!validateParameterType(args[i], param.type)) {
            valid = false;
            invalidParamIndex = i;
            break;
        }
    }
    
    return {
        command,
        args,
        valid,
        invalidParamIndex
    };
}

/**
 * Gets the current parameter index based on cursor position
 */
export function getCurrentParameterIndex(input: string, cursorPosition: number): number {
    const beforeCursor = input.slice(0, cursorPosition);
    const withoutSlash = beforeCursor.startsWith('/') ? beforeCursor.slice(1) : beforeCursor;
    const parts = withoutSlash.split(/\s+/);
    
    // Subtract 1 for the command itself
    return Math.max(0, parts.length - 2);
}
