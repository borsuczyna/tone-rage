import { createApp } from 'vue';
import RageInterface from './RageInterface.vue';
import { isInterfaceVisible, setInterfaceVisible } from '../Hooks/InterfaceVisibilityProvider.ts';
import { initUserInfoProvider } from '../Hooks/UserInfoProvider.ts';
import { initChatProvider } from '../Hooks/ChatProvider.ts';
import './Interfaces/Styles/Main.css';

export function isInBrowser() {
    return typeof mp === "undefined";
}

// load debug background only when running in a regular browser environment
if (isInBrowser()) {
    void import('./Interfaces/Styles/DebugBg.css');
}

export function mountRageInterface() {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const app = createApp(RageInterface);
    app.mount(rootElement);
}

export function mountRageEvents() {
    if (typeof mp === "undefined" || !mp?.events) {
        console.warn("mp.events is not available");
        return;
    }
        
    mp.events.add('setInterfaceVisible', (name: string, visible: boolean) => {
        setInterfaceVisible(name, visible);
    });

    mp.events.add('toggleInterfaceVisibility', (name: string) => {
        setInterfaceVisible(name, !isInterfaceVisible(name));
    });
}

// change rem size
function updateRemSize() {
    const baseSize = 16;
    const newSize = baseSize * (window.innerWidth / 1920);
    document.documentElement.style.fontSize = `${newSize}px`;
}

export function getRemAsPx(value: string | number): number {
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
