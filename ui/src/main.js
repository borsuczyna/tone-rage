import { registerFetchResolver } from './Hooks/Fetch';
import { ChunkAssemblerHandler, CustomEventHandler } from './Hooks/RageEventStore';
import { setInterfaceVisible, isInterfaceVisible } from './Hooks/InterfaceVisibilityStore';
import { updateUserInfo } from './Hooks/UserInfoStore';
import { addNotification } from './Hooks/NotificationsStore';
import { chat } from './Hooks/ChatStore';
import TextureService from './Services/TextureService';
import { mount } from 'svelte';
import App from './Interface/App.svelte';
import './Interface/Interfaces/Styles/Main.css';
export function isInBrowser() {
    return typeof mp === "undefined";
}
// load debug background only when running in a regular browser environment
if (isInBrowser()) {
    void import('./Interface/Interfaces/Styles/DebugBg.css');
}
function mountRageInterface() {
    const root = document.getElementById('root');
    if (!root)
        return;
    mount(App, {
        target: root
    });
}
function mountRageEvents() {
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
    // Register event handlers for stores
    CustomEventHandler.registerEventHandler('updateUserInfo', updateUserInfo);
    CustomEventHandler.registerEventHandler('addNotification', (data) => {
        addNotification(data.title, data.message, data.type, data.icon, data.iconFillOpacity);
    });
    CustomEventHandler.registerEventHandler('chat:receiveMessage', (message) => {
        chat.addMessage(message);
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
// Initialize everything
mountRageInterface();
mountRageEvents();
registerFetchResolver();
ChunkAssemblerHandler.init();
TextureService.init();
