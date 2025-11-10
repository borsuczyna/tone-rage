import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { addNotification, useNotifications } from 'src/Hooks/NotificationsProvider';
import styles from './styles/NotificationsInterface.module.css';
import Notification from './Components/Notifications/Notification';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import type { NotificationData } from '@shared/Models/NotificationData';

const playNotificationSound = (type: string) => {
    const soundMap: Record<string, string> = {
        'error': 'sounds/notifications/error.mp3',
        'info': 'sounds/notifications/info.mp3',
        'success': 'sounds/notifications/success.mp3',
        'warning': 'sounds/notifications/warning.mp3'
    };

    const soundPath = soundMap[type];
    if (soundPath) {
        const audio = new Audio(soundPath);
        audio.volume = 0.5;
        audio.play().catch((error) => {
            console.error('Failed to play notification sound:', error);
        });
    }
};

export default function NotificationsInterface() {
    const { notifications } = useNotifications();
    const { isInterfaceVisible } = useInterfaceVisibility();
    const top = isInterfaceVisible('HudInterface') ? '14rem' : '1rem';

    useRageEvent('addNotification', (data: NotificationData) => {
        addNotification(data.title, data.message, data.type, data.icon, data.iconFillOpacity);
        playNotificationSound(data.type);
    });

    return (
        <div className={styles.main} style={{ top }}>
            {notifications.map((notification) => (
                <Notification key={notification.key} data={notification} />
            ))}
        </div>
    )
}