import { createRoot } from "react-dom/client";
import RageInterface from "./RageInterface";
import { isInterfaceVisible, setInterfaceVisible } from "../Hooks/InterfaceVisibilityProvider";
import './Interfaces/Styles/Main.css';
export function isInBrowser() {
    return typeof mp === "undefined";
}
// load debug background only when running in a regular browser environment
if (isInBrowser()) {
    void import('./Interfaces/Styles/DebugBg.css');
}
export function mountRageInterface() {
    const root = document.getElementById('root');
    if (!root)
        return;
    const rootElement = createRoot(root);
    rootElement.render(<RageInterface />);
}
export function mountRageEvents() {
    if (typeof mp === "undefined" || !mp?.events) {
        console.warn("mp.events is not available");
        return;
    }
    mp.events.add('setInterfaceVisible', (name, visible) => {
        setInterfaceVisible(name, visible);
    });
    mp.events.add('toggleInterfaceVisibility', (name) => {
        setInterfaceVisible(name, !isInterfaceVisible(name));
    });
}
// change rem size
function updateRemSize() {
    const baseSize = 16;
    const newSize = baseSize * (window.innerWidth / 1920);
    document.documentElement.style.fontSize = `${newSize}px`;
}
export function getRemAsPx(value) {
    const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (typeof value === 'string') {
        if (value.endsWith('rem')) {
            value = value.slice(0, -3);
        }
        return parseFloat(value) * remSize;
    }
    return value * remSize;
}
window.addEventListener('resize', () => {
    updateRemSize();
});
// initial rem size setup
updateRemSize();
