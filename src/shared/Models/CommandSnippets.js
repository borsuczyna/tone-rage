export const CommandParamType = {
    String: 'string',
    Number: 'number',
    RestOfText: 'rest'
};
export function validateParam(param, value) {
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
