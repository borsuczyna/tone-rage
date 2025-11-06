import { useInterfaceVisibility } from "../Hooks/InterfaceVisibilityProvider";
import Providers from "../Hooks/Providers";
import NotificationsInterface from "./Interfaces/NotificationsInterface";
import AuthInterface from "./Interfaces/AuthInterface";
import SpawnSelectionInterface from "./Interfaces/SpawnSelectionInterface";

function Interfaces() {
    const { visibleInterfaces } = useInterfaceVisibility();
    const isInterfaceVisible = (name: string) => {
        return visibleInterfaces[name];
    };

    return (
        <>
            {/* Define here all the interface elements */}
            {isInterfaceVisible("NotificationsInterface") && <NotificationsInterface key="NotificationsInterface" />}
            {isInterfaceVisible("AuthInterface") && <AuthInterface key="AuthInterface" />}
            {isInterfaceVisible("SpawnSelectionInterface") && <SpawnSelectionInterface key="SpawnSelectionInterface" />}
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