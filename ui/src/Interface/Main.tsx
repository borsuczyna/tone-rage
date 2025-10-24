import { createRoot } from "react-dom/client";
import RageInterface from "./RageInterface";
import { isInterfaceVisible, setInterfaceVisible } from "../Hooks/InterfaceVisibilityProvider";

export function mountRageInterface() {
    const root = document.getElementById('root');
    if (!root) return;

    const rootElement = createRoot(root);
    rootElement.render(<RageInterface />);
}

export function mountRageEvents() {
    mp.events.add('setInterfaceVisible', (name: string, visible: boolean) => {
        setInterfaceVisible(name, visible);
    });

    mp.events.add('toggleInterfaceVisibility', (name: string) => {
        setInterfaceVisible(name, !isInterfaceVisible(name));
    });
}