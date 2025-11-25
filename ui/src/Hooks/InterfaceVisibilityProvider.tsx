import React, { createContext, useContext, useState } from 'react';

type InterfaceMap = Record<string, boolean>;
let externalSetInterfaceVisible: ((name: string, visible: boolean) => void) | null = null;
let externalIsInterfaceVisible : ((name: string) => boolean) | null = null;

interface InterfaceVisibilityHook {
    visibleInterfaces: InterfaceMap;
    setInterfaceVisible: (name: string, visible: boolean) => void;
    isInterfaceVisible: (name: string) => boolean;
}

const InterfaceVisibilityContext = createContext<InterfaceVisibilityHook | undefined>(undefined);

export const InterfaceVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
    const [visibleInterfaces, setVisibleInterfaces] = useState<InterfaceMap>({
        // 'ScoreboardInterface': true,
        // 'HudInterface': true,
        // 'NotificationsInterface': true,
        // 'AuthInterface': true,  // Set to true for development/testing
        // 'SpawnSelectionInterface': true  // Set to true for development/testing
        // 'AtmInterface': true  // Set to true for development/testing
        // 'LoadingInterface': true  // Set to true for development/testing
    });

    const setInterfaceVisible = (name: string, visible: boolean) => {
        setVisibleInterfaces((prev) => ({ ...prev, [name]: visible }));
    };

    const isInterfaceVisible = (name: string) => {
        return visibleInterfaces[name] || false;
    };

    externalSetInterfaceVisible = setInterfaceVisible;
    externalIsInterfaceVisible = isInterfaceVisible;

    return (
        <InterfaceVisibilityContext.Provider value={{ visibleInterfaces, setInterfaceVisible, isInterfaceVisible }}>
            {children}
        </InterfaceVisibilityContext.Provider>
    );
};

export const useInterfaceVisibility = () => {
    const context = useContext(InterfaceVisibilityContext);
    if (!context) {
        throw new Error('useInterfaceVisibility must be used within InterfaceVisibilityProvider');
    }
    return context;
};

export const setInterfaceVisible = (name: string, visible: boolean) => {
    if (!externalSetInterfaceVisible) {
        console.warn('InterfaceVisibilityProvider is not mounted yet');
        return;
    }
    externalSetInterfaceVisible(name, visible);
};

export const isInterfaceVisible = (name: string): boolean => {
    if (!externalIsInterfaceVisible) {
        console.warn('InterfaceVisibilityProvider is not mounted yet');
        return false;
    }

    return externalIsInterfaceVisible(name);
};