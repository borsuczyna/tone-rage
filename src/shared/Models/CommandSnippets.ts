export const CommandParamType = {
    String: 'string',
    Number: 'number',
    RestOfText: 'rest'
} as const;

export type CommandParamType = typeof CommandParamType[keyof typeof CommandParamType];

export interface CommandParam {
    type: CommandParamType;
    name: string;
}

export interface CommandSnippet {
    command: string;
    description: string;
    params?: CommandParam[];
}

export interface CommandData {
    snippet: CommandSnippet;
    listeners: Function[];
}

export function validateParam(param: CommandParamType, value: string): boolean {
    switch (param) {
        case CommandParamType.String:
            return value.trim().length > 0;
        case CommandParamType.Number:
            return !isNaN(Number(value)) && value.trim().length > 0;
        case CommandParamType.RestOfText:
            return value.trim().length > 0;
        default:
            return false;
    }
}