declare global {
    interface Mp {
        events: {
            add: (name: string, listener: (...args: any[]) => void) => void;
            remove: (name: string, listener: (...args: any[]) => void) => void;
        };

        trigger: (name: string, ...args: any[]) => void;
    }

    const mp: Mp;
}

export {};