import { writable } from 'svelte/store';
function createInterfaceVisibilityStore() {
    const { subscribe, update } = writable({
    // 'ScoreboardInterface': true,
    // 'HudInterface': true,
    // 'NotificationsInterface': true,
    // 'AuthInterface': true,
    // 'SpawnSelectionInterface': true
    // 'AtmInterface': true
    // 'MapDemoInterface': true
    // 'ChatInterface': true
    // 'WorldInteractionInterface': true
    // 'CharacterCreatorInterface': true
    // 'TopsMakerInterface': true
    });
    return {
        subscribe,
        setInterfaceVisible: (name, visible) => {
            update(interfaces => ({ ...interfaces, [name]: visible }));
        },
        isInterfaceVisible: (name) => {
            let result = false;
            subscribe(interfaces => {
                result = interfaces[name] || false;
            })();
            return result;
        }
    };
}
export const interfaceVisibility = createInterfaceVisibilityStore();
export const setInterfaceVisible = (name, visible) => {
    interfaceVisibility.setInterfaceVisible(name, visible);
};
export const isInterfaceVisible = (name) => {
    return interfaceVisibility.isInterfaceVisible(name);
};
