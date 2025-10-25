import { InterfaceVisibilityProvider } from "./InterfaceVisibilityProvider";
import { NotificationsProvider } from "./NotificationsProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <InterfaceVisibilityProvider>
            <NotificationsProvider>
                {children}
            </NotificationsProvider>
        </InterfaceVisibilityProvider>
    )
}