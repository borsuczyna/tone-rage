import { writable } from 'svelte/store';
import { generateHash } from '@shared/Hash';
import { NotificationType } from '@shared/Models/NotificationType';
function createNotificationsStore() {
    const { subscribe, update } = writable([]);
    const timers = new Map();
    const clearNotificationTimers = (key) => {
        const notificationTimers = timers.get(key);
        if (notificationTimers) {
            clearTimeout(notificationTimers.hideTimer);
            clearTimeout(notificationTimers.removeTimer);
            timers.delete(key);
        }
    };
    const removeNotification = (key) => {
        clearNotificationTimers(key);
        update(notifications => notifications.filter(notif => notif.key !== key));
    };
    const addNotification = (title, message, type = NotificationType.Info, icon, iconFillOpacity) => {
        const newNotification = {
            title,
            message,
            type,
            key: generateHash(`notification-${Date.now()}`),
            hiding: false,
            icon,
            iconFillOpacity
        };
        update(notifications => {
            const updatedNotifications = [...notifications, newNotification];
            // If we have more than 7 notifications, start hiding animation for oldest ones
            if (updatedNotifications.length > 7) {
                const notificationsToHide = updatedNotifications.slice(0, updatedNotifications.length - 7);
                notificationsToHide.forEach(notif => {
                    // Clear existing timers for these notifications
                    clearNotificationTimers(notif.key);
                    // Start hiding animation immediately
                    update(current => current.map(n => n.key === notif.key
                        ? { ...n, hiding: true }
                        : n));
                    // Remove after animation completes (500ms)
                    const removeTimer = setTimeout(() => {
                        removeNotification(notif.key);
                    }, 500);
                    // Store the remove timer
                    timers.set(notif.key, { hideTimer: 0, removeTimer });
                });
            }
            return updatedNotifications;
        });
        // Start hiding animation after 5 seconds
        const hideTimer = setTimeout(() => {
            update(notifications => notifications.map(notif => notif.key === newNotification.key
                ? { ...notif, hiding: true }
                : notif));
        }, 5000);
        // Remove notification after 5.5 seconds
        const removeTimer = setTimeout(() => {
            removeNotification(newNotification.key);
        }, 5500);
        // Store timers for this notification
        timers.set(newNotification.key, { hideTimer, removeTimer });
    };
    return {
        subscribe,
        addNotification
    };
}
export const notifications = createNotificationsStore();
export const addNotification = (title, message, type = NotificationType.Info, icon, iconFillOpacity) => {
    notifications.addNotification(title, message, type, icon, iconFillOpacity);
};
