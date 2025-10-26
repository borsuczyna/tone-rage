import { NotificationType } from "./NotificationType";

export interface NotificationData {
    title: string;
    message: string;
    type: NotificationType;
    key: string;
    hiding?: boolean;
    icon?: string;
    iconFillOpacity?: number;
}