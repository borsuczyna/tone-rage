import { writable } from 'svelte/store';

type InterfaceMap = Record<string, boolean>;

function createInterfaceVisibilityStore() {
    const { subscribe, update } = writable<InterfaceMap>({
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
        setInterfaceVisible: (name: string, visible: boolean) => {
            update(interfaces => ({ ...interfaces, [name]: visible }));
        },
        isInterfaceVisible: (name: string): boolean => {
            let result = false;
            subscribe(interfaces => {
                result = interfaces[name] || false;
            })();
            return result;
        }
    };
}

export const interfaceVisibility = createInterfaceVisibilityStore();

export const setInterfaceVisible = (name: string, visible: boolean) => {
    interfaceVisibility.setInterfaceVisible(name, visible);
};

export const isInterfaceVisible = (name: string): boolean => {
    return interfaceVisibility.isInterfaceVisible(name);
};
