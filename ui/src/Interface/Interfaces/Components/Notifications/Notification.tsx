import type { NotificationData } from '@shared/Enums/NotificationData';
import styles from '../../styles/NotificationsInterface.module.css';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { NotificationType } from '@shared/Enums/NotificationType';

const defaultIcons: {
    [key in NotificationType]: IconName;
} = {
    [NotificationType.Info]: 'bell',
    [NotificationType.Warning]: 'alert-triangle',
    [NotificationType.Error]: 'x-circle',
    [NotificationType.Success]: 'check-circle',
}

export default function Notification({ data }: { data: NotificationData }) {
    const notificationClasses = [
        styles.notification,
        styles[data.type.toLowerCase()],
        data.hiding ? styles.hiding : ''
    ].filter(Boolean).join(' ');

    const icon = data.icon ? data.icon as IconName : defaultIcons[data.type];
    const iconFillOpacity = data.iconFillOpacity !== undefined ? data.iconFillOpacity : 0.1;

    return (
        <div className={styles.notificationWrapper}>
            <div className={notificationClasses}>
                <div className={styles.titleWrapper}>
                    <DynamicIcon className={styles.title} name={icon} fill="currentColor" fillOpacity={iconFillOpacity} size="1rem" />
                    <span className={styles.title}>{data.title}</span>
                </div>
                <span className={styles.message}>{data.message}</span>
                <span className={styles.rightBar}></span>
            </div>
        </div>
    )
}