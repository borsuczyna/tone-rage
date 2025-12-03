import { InterfaceVisibilityProvider } from "./InterfaceVisibilityProvider";
import { NotificationsProvider } from "./NotificationsProvider";
import { UserInfoProvider } from "./UserInfoProvider";
import { ChatProvider } from "./ChatProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <InterfaceVisibilityProvider>
            <NotificationsProvider>
                <UserInfoProvider>
                    <ChatProvider>
                        {children}
                    </ChatProvider>
                </UserInfoProvider>
            </NotificationsProvider>
        </InterfaceVisibilityProvider>
    )
}