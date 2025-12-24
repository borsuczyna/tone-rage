import React, { createContext, useContext, useState } from 'react';
let externalSetInterfaceVisible = null;
let externalIsInterfaceVisible = null;
const InterfaceVisibilityContext = createContext(undefined);
export const InterfaceVisibilityProvider = ({ children }) => {
    const [visibleInterfaces, setVisibleInterfaces] = useState({
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
    const setInterfaceVisible = (name, visible) => {
        setVisibleInterfaces((prev) => ({ ...prev, [name]: visible }));
    };
    const isInterfaceVisible = (name) => {
        return visibleInterfaces[name] || false;
    };
    externalSetInterfaceVisible = setInterfaceVisible;
    externalIsInterfaceVisible = isInterfaceVisible;
    return (<InterfaceVisibilityContext.Provider value={{ visibleInterfaces, setInterfaceVisible, isInterfaceVisible }}>
            {children}
        </InterfaceVisibilityContext.Provider>);
};
export const useInterfaceVisibility = () => {
    const context = useContext(InterfaceVisibilityContext);
    if (!context) {
        throw new Error('useInterfaceVisibility must be used within InterfaceVisibilityProvider');
    }
    return context;
};
export const setInterfaceVisible = (name, visible) => {
    if (!externalSetInterfaceVisible) {
        console.warn('InterfaceVisibilityProvider is not mounted yet');
        return;
    }
    externalSetInterfaceVisible(name, visible);
};
export const isInterfaceVisible = (name) => {
    if (!externalIsInterfaceVisible) {
        console.warn('InterfaceVisibilityProvider is not mounted yet');
        return false;
    }
    return externalIsInterfaceVisible(name);
};
