import { useInterfaceVisibility } from "../Hooks/InterfaceVisibilityProvider";
import Providers from "../Hooks/Providers";
import TestInterface from "./Interfaces/TestInterface"
import CircleInterface from "./Interfaces/CircleInterface";
import NotificationsInterface from "./Interfaces/NotificationsInterface";
import NotificationTester from "./Interfaces/NotificationTester";

function Interfaces() {
    const { visibleInterfaces } = useInterfaceVisibility();
    const isInterfaceVisible = (name: string) => {
        return visibleInterfaces[name];
    };

    return (
        <>
            {/* Define here all the interface elements */}
            {isInterfaceVisible("TestInterface") && <TestInterface key="TestInterface" />}
            {isInterfaceVisible("CircleInterface") && <CircleInterface key="CircleInterface" />}
            {isInterfaceVisible("NotificationsInterface") && <NotificationsInterface key="NotificationsInterface" />}
            {isInterfaceVisible("NotificationTester") && <NotificationTester key="NotificationTester" />}
        </>
    )
}

export default function RageInterface() {
    return (
        <div>
            <Providers>
                <Interfaces />
            </Providers>
        </div>
    );
}