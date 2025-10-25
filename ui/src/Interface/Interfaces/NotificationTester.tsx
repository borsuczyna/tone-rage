import { useNotifications } from 'src/Hooks/NotificationsProvider';
import { NotificationType } from '@shared/Enums/NotificationType';
import { dynamicIconImports } from 'lucide-react/dynamic';

export default function NotificationTester() {
    const { addNotification } = useNotifications();

    const handleTestNotification = (type: NotificationType) => {
        const messages = {
            [NotificationType.Info]: { title: 'Info', message: 'This is an info notification. It provides useful information to the user about the current state or action.' },
            [NotificationType.Success]: { title: 'Success', message: 'Operation completed successfully! Congratulations on your achievement.' },
            [NotificationType.Warning]: { title: 'Warning', message: 'Please be careful! Beware of the consequences that may arise from your actions.' },
            [NotificationType.Error]: { title: 'Error', message: 'Something went wrong! Lorem ipsum dolor sit amet.' }
        };

        const { title, message } = messages[type];
        const randomIconNames = Object.keys(dynamicIconImports);
        const randomIcon = randomIconNames[Math.floor(Math.random() * randomIconNames.length)];
        addNotification(title, message, type, randomIcon);
    };

    return (
        <div style={{ 
            position: 'fixed', 
            bottom: '1rem', 
            left: '1rem', 
            display: 'flex', 
            gap: '0.5rem',
            flexDirection: 'column'
        }}>
            <button onClick={() => handleTestNotification(NotificationType.Info)}>
                Test Info
            </button>
            <button onClick={() => handleTestNotification(NotificationType.Success)}>
                Test Success
            </button>
            <button onClick={() => handleTestNotification(NotificationType.Warning)}>
                Test Warning
            </button>
            <button onClick={() => handleTestNotification(NotificationType.Error)}>
                Test Error
            </button>
        </div>
    );
}