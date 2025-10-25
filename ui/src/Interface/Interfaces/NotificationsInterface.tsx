import { useInterfaceVisibility } from 'src/Hooks/InterfaceVisibilityProvider';
import { useNotifications } from 'src/Hooks/NotificationsProvider';
import styles from './styles/NotificationsInterface.module.css';
import Notification from './Components/Notifications/Notification';

export default function NotificationsInterface() {
    const { notifications } = useNotifications();
    const { isInterfaceVisible } = useInterfaceVisibility();
    const top = isInterfaceVisible('HudInterface') ? '4rem' : '1rem';

    return (
        <div className={styles.main} style={{ top }}>
            {notifications.map((notification) => (
                <Notification key={notification.key} data={notification} />
            ))}
        </div>
    )
}