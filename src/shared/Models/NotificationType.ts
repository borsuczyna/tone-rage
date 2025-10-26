export const NotificationType = {
    Info: 'info',
    Warning: 'warning',
    Error: 'error',
    Success: 'success',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];