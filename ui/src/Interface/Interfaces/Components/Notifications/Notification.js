import styles from '../../Styles/NotificationsInterface.module.css';
import * as Icons from "lucide-react";
import { NotificationType } from '@shared/Models/NotificationType';
// import { NotificationType } from '@shared/Models/NotificationType';
const defaultIcons = {
    [NotificationType.Info]: 'bell',
    [NotificationType.Warning]: 'alert-triangle',
    [NotificationType.Error]: 'x-circle',
    [NotificationType.Success]: 'check-circle',
};
export default function Notification({ data }) {
    const notificationClasses = [
        styles.notification,
        styles[data.type.toLowerCase()],
        data.hiding ? styles.hiding : ''
    ].filter(Boolean).join(' ');
    const icon = data.icon ? data.icon : defaultIcons[data.type];
    const iconFillOpacity = data.iconFillOpacity !== undefined ? data.iconFillOpacity : 0.1;
    const IconJSX = Icons[icon.charAt(0).toUpperCase() + icon.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())] || Icons['Bell'];
    const message = data.message.split('\n').map((line, index) => (<span key={index}>
            {line}
            {index < data.message.split('\n').length - 1 && <br />}
        </span>));
    return (<div className={styles.notificationWrapper}>
            <div className={notificationClasses}>
                <div className={styles.titleWrapper}>
                    <IconJSX className={styles.title} fill="currentColor" fillOpacity={iconFillOpacity} size="1rem"/>
                    <span className={styles.title}>{data.title}</span>
                </div>
                <span className={styles.message}>{message}</span>
                <span className={styles.rightBar}></span>
            </div>
        </div>);
}
