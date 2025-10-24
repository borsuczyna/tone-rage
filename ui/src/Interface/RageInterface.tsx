import React from "react";
import { InterfaceVisibilityProvider, useInterfaceVisibility } from "../Hooks/InterfaceVisibilityProvider";
import TestInterface from "./Interfaces/TestInterface"
import CircleInterface from "./Interfaces/CircleInterface";

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <InterfaceVisibilityProvider>
            {children}
        </InterfaceVisibilityProvider>
    )
}

function Interfaces() {
    const { visibleInterfaces } = useInterfaceVisibility();
    const isInterfaceVisible = (name: string) => {
        return visibleInterfaces[name];
    };

    return (
        <>
            {/* Define here all the interface elements */}
            {isInterfaceVisible("TestInterface") && <TestInterface key="TestInterface" />}
            {isInterfaceVisible("CircleInterface") && <CircleInterface key="CircleInterface" />}
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