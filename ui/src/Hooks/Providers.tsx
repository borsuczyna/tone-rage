import { InterfaceVisibilityProvider } from "./InterfaceVisibilityProvider";
import { NotificationsProvider } from "./NotificationsProvider";
import { UserInfoProvider } from "./UserInfoProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <InterfaceVisibilityProvider>
            <NotificationsProvider>
                <UserInfoProvider>
                    {children}
                </UserInfoProvider>
            </NotificationsProvider>
        </InterfaceVisibilityProvider>
    )
}