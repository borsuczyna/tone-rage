import { reactive, readonly } from 'vue';

type InterfaceMap = Record<string, boolean>;

interface InterfaceVisibilityState {
    visibleInterfaces: InterfaceMap;
}

const state = reactive<InterfaceVisibilityState>({
    visibleInterfaces: {
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
    }
});

export function useInterfaceVisibility() {
    const setInterfaceVisible = (name: string, visible: boolean) => {
        state.visibleInterfaces[name] = visible;
    };

    const isInterfaceVisible = (name: string) => {
        return state.visibleInterfaces[name] || false;
    };

    return {
        visibleInterfaces: readonly(state.visibleInterfaces),
        setInterfaceVisible,
        isInterfaceVisible
    };
}

export const setInterfaceVisible = (name: string, visible: boolean) => {
    state.visibleInterfaces[name] = visible;
};

export const isInterfaceVisible = (name: string): boolean => {
    return state.visibleInterfaces[name] || false;
};
