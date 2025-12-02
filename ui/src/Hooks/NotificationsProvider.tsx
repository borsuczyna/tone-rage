import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { generateHash } from '@shared/Hash';
import type { NotificationData } from '@shared/Models/NotificationData';
import { NotificationType } from '@shared/Models/NotificationType';

type AddNotificationFunction = (title: string, message: string, type?: NotificationType, icon?: string, iconFillOpacity?: number) => void;
let externalAddNotification: AddNotificationFunction | null = null;

interface NotificationContextType {
    notifications: NotificationData[];
    addNotification: AddNotificationFunction;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
}

interface NotificationsProviderProps {
    children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [timers, setTimers] = useState<Map<string, { hideTimer: number; removeTimer: number }>>(new Map());

    const clearNotificationTimers = useCallback((key: string) => {
        const notificationTimers = timers.get(key);
        if (notificationTimers) {
            clearTimeout(notificationTimers.hideTimer);
            clearTimeout(notificationTimers.removeTimer);
            setTimers(prev => {
                const newTimers = new Map(prev);
                newTimers.delete(key);
                return newTimers;
            });
        }
    }, [timers]);

    const removeNotification = useCallback((key: string) => {
        clearNotificationTimers(key);
        setNotifications(prev => prev.filter(notif => notif.key !== key));
    }, [clearNotificationTimers]);

    const addNotification = useCallback((
        title: string, 
        message: string, 
        type: NotificationType = NotificationType.Info,
        icon?: string,
        iconFillOpacity?: number
    ) => {
        const newNotification: NotificationData = {
            title,
            message,
            type,
            key: generateHash(`notification-${Date.now()}`),
            hiding: false,
            icon,
            iconFillOpacity
        };

        setNotifications(prev => {
            const updatedNotifications = [...prev, newNotification];
            
            // If we have more than 7 notifications, start hiding animation for oldest ones
            if (updatedNotifications.length > 7) {
                const notificationsToHide = updatedNotifications.slice(0, updatedNotifications.length - 7);
                notificationsToHide.forEach(notif => {
                    // Clear existing timers for these notifications
                    clearNotificationTimers(notif.key);
                    
                    // Start hiding animation immediately
                    setNotifications(current => 
                        current.map(n => 
                            n.key === notif.key 
                                ? { ...n, hiding: true }
                                : n
                        )
                    );
                    
                    // Remove after animation completes (500ms)
                    const removeTimer = setTimeout(() => {
                        removeNotification(notif.key);
                    }, 500);
                    
                    // Store the remove timer
                    setTimers(currentTimers => {
                        const newTimers = new Map(currentTimers);
                        newTimers.set(notif.key, { hideTimer: 0, removeTimer });
                        return newTimers;
                    });
                });
            }
            
            return updatedNotifications;
        });

        // Start hiding animation after 5 seconds
        const hideTimer = setTimeout(() => {
            setNotifications(prev => 
                prev.map(notif => 
                    notif.key === newNotification.key 
                        ? { ...notif, hiding: true }
                        : notif
                )
            );
        }, 5000);

        // Remove notification after 5.5 seconds
        const removeTimer = setTimeout(() => {
            removeNotification(newNotification.key);
        }, 5500);

        // Store timers for this notification
        setTimers(prev => {
            const newTimers = new Map(prev);
            newTimers.set(newNotification.key, { hideTimer, removeTimer });
            return newTimers;
        });
    }, [clearNotificationTimers, removeNotification]);

    // Set the external function reference
    externalAddNotification = addNotification;

    const value: NotificationContextType = {
        notifications,
        addNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export const addNotification = (title: string, message: string, type: NotificationType = NotificationType.Info, icon?: string, iconFillOpacity?: number) => {
    if (!externalAddNotification) {
        console.warn('NotificationsProvider is not mounted yet');
        return;
    }
    externalAddNotification(title, message, type, icon, iconFillOpacity);
};