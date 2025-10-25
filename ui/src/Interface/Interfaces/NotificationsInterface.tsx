import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { addNotification, useNotifications } from 'src/Hooks/NotificationsProvider';
import styles from './styles/NotificationsInterface.module.css';
import Notification from './Components/Notifications/Notification';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import type { NotificationData } from '@shared/Enums/NotificationData';

export default function NotificationsInterface() {
    const { notifications } = useNotifications();
    const { isInterfaceVisible } = useInterfaceVisibility();
    const top = isInterfaceVisible('HudInterface') ? '4rem' : '1rem';

    useRageEvent('addNotification', (data: NotificationData) => {
        addNotification(data.title, data.message, data.type, data.icon, data.iconFillOpacity);
    });

    return (
        <div className={styles.main} style={{ top }}>
            {notifications.map((notification) => (
                <Notification key={notification.key} data={notification} />
            ))}
        </div>
    )
}