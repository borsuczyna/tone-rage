import { InterfaceVisibilityProvider } from "./InterfaceVisibilityProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <InterfaceVisibilityProvider>
            {children}
        </InterfaceVisibilityProvider>
    )
}