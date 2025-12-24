import { reactive, readonly } from 'vue';
import { generateHash } from '@shared/Hash';
import type { NotificationData } from '@shared/Models/NotificationData';
import { NotificationType } from '@shared/Models/NotificationType';

interface NotificationState {
    notifications: NotificationData[];
    timers: Map<string, { hideTimer: number; removeTimer: number }>;
}

const state = reactive<NotificationState>({
    notifications: [],
    timers: new Map()
});

function clearNotificationTimers(key: string) {
    const notificationTimers = state.timers.get(key);
    if (notificationTimers) {
        clearTimeout(notificationTimers.hideTimer);
        clearTimeout(notificationTimers.removeTimer);
        state.timers.delete(key);
    }
}

function removeNotification(key: string) {
    clearNotificationTimers(key);
    state.notifications = state.notifications.filter(notif => notif.key !== key);
}

function addNotificationInternal(
    title: string,
    message: string,
    type: NotificationType = NotificationType.Info,
    icon?: string,
    iconFillOpacity?: number
) {
    const newNotification: NotificationData = {
        title,
        message,
        type,
        key: generateHash(`notification-${Date.now()}`),
        hiding: false,
        icon,
        iconFillOpacity
    };

    state.notifications.push(newNotification);

    // If we have more than 7 notifications, start hiding animation for oldest ones
    if (state.notifications.length > 7) {
        const notificationsToHide = state.notifications.slice(0, state.notifications.length - 7);
        notificationsToHide.forEach(notif => {
            // Clear existing timers for these notifications
            clearNotificationTimers(notif.key);

            // Start hiding animation immediately
            const notification = state.notifications.find(n => n.key === notif.key);
            if (notification) {
                notification.hiding = true;
            }

            // Remove after animation completes (500ms)
            const removeTimer = setTimeout(() => {
                removeNotification(notif.key);
            }, 500);

            // Store the remove timer
            state.timers.set(notif.key, { hideTimer: 0, removeTimer });
        });
    }

    // Start hiding animation after 5 seconds
    const hideTimer = setTimeout(() => {
        const notification = state.notifications.find(n => n.key === newNotification.key);
        if (notification) {
            notification.hiding = true;
        }
    }, 5000);

    // Remove notification after 5.5 seconds
    const removeTimer = setTimeout(() => {
        removeNotification(newNotification.key);
    }, 5500);

    // Store timers for this notification
    state.timers.set(newNotification.key, { hideTimer, removeTimer });
}

export function useNotifications() {
    return {
        notifications: readonly(state.notifications),
        addNotification: addNotificationInternal
    };
}

export const addNotification = (
    title: string,
    message: string,
    type: NotificationType = NotificationType.Info,
    icon?: string,
    iconFillOpacity?: number
) => {
    addNotificationInternal(title, message, type, icon, iconFillOpacity);
};
