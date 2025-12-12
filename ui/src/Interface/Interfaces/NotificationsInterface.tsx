import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { addNotification, useNotifications } from 'src/Hooks/NotificationsProvider';
import styles from './Styles/NotificationsInterface.module.css';
import Notification from './Components/Notifications/Notification';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import type { NotificationData } from '@shared/Models/NotificationData';
import AudioService from 'src/Services/AudioService';
import { useEffect, useCallback } from 'react';

// Preload notification sounds for better performance
const notificationSounds = [
    '/sounds/notifications/error.mp3',
    '/sounds/notifications/info.mp3',
    '/sounds/notifications/success.mp3',
    '/sounds/notifications/warning.mp3'
];

const playNotificationSound = (type: string) => {
    const soundMap: Record<string, string> = {
        'error': '/sounds/notifications/error.mp3',
        'info': '/sounds/notifications/info.mp3',
        'success': '/sounds/notifications/success.mp3',
        'warning': '/sounds/notifications/warning.mp3'
    };

    const soundPath = soundMap[type];
    if (soundPath) {
        AudioService.playSound(soundPath, { volume: 0.5 });
    }
};

export default function NotificationsInterface() {
    const { notifications } = useNotifications();
    const { isInterfaceVisible } = useInterfaceVisibility();
    const top = isInterfaceVisible('HudInterface') ? '14rem' : '1rem';

    // Preload notification sounds when component mounts
    useEffect(() => {
        AudioService.preloadSounds(notificationSounds);
        
        // Cleanup on unmount
        return () => {
            notificationSounds.forEach(sound => {
                AudioService.unloadSound(sound);
            });
        };
    }, []);

    useRageEvent('addNotification', useCallback((data: NotificationData) => {
        addNotification(data.title, data.message, data.type, data.icon, data.iconFillOpacity);
        playNotificationSound(data.type);
    }, []));

    return (
        <div className={styles.main} style={{ top }}>
            {notifications.map((notification) => (
                <Notification key={notification.key} data={notification} />
            ))}
        </div>
    )
}