declare global {
    interface Mp {
        events: {
            add: (name: string, listener: (...args: any[]) => void) => void;
            remove: (name: string, listener: (...args: any[]) => void) => void;
        };
    }

    const mp: Mp;
}

export {};