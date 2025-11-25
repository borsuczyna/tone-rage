import { useInterfaceVisibility } from "../Hooks/InterfaceVisibilityProvider";
import Providers from "../Hooks/Providers";
import NotificationsInterface from "./Interfaces/NotificationsInterface";
import AuthInterface from "./Interfaces/AuthInterface";
import SpawnSelectionInterface from "./Interfaces/SpawnSelectionInterface";
import HudInterface from "./Interfaces/HudInterface";
import ScoreboardInterface from "./Interfaces/ScoreboardInterface";
import HandlingEditorInterface from "./Interfaces/HandlingEditorInterface";
import AtmInterface from "./Interfaces/AtmInterface";
import LoadingInterface from "./Interfaces/LoadingInterface";
import InteractionWheelInterface from "./Interfaces/InteractionWheelInterface";
import MapTestInterface from "./Interfaces/MapTestInterface";

function Interfaces() {
    const { visibleInterfaces } = useInterfaceVisibility();
    const isInterfaceVisible = (name: string) => {
        return visibleInterfaces[name];
    };

    return (
        <>
            {/* Define here all the interface elements */}
            {isInterfaceVisible("LoadingInterface") && <LoadingInterface key="LoadingInterface" />}
            {isInterfaceVisible("HudInterface") && <HudInterface key="HudInterface" />}
            {isInterfaceVisible("NotificationsInterface") && <NotificationsInterface key="NotificationsInterface" />}
            {isInterfaceVisible("AuthInterface") && <AuthInterface key="AuthInterface" />}
            {isInterfaceVisible("SpawnSelectionInterface") && <SpawnSelectionInterface key="SpawnSelectionInterface" />}
            {isInterfaceVisible("ScoreboardInterface") && <ScoreboardInterface key="ScoreboardInterface" />}
            {isInterfaceVisible("HandlingEditorInterface") && <HandlingEditorInterface key="HandlingEditorInterface" />}
            {isInterfaceVisible("AtmInterface") && <AtmInterface key="AtmInterface" />}
            {isInterfaceVisible("InteractionWheelInterface") && <InteractionWheelInterface key="InteractionWheelInterface" />}
            {isInterfaceVisible("MapTestInterface") && <MapTestInterface key="MapTestInterface" />}
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