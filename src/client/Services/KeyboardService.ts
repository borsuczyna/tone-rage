import { getKeyCode, InputKey } from "@shared/KeyMap";

export enum KeyState {
    Up = 0,
    Down = 1,
}

export default class KeyboardService {
    private static keyHandlers: Map<InputKey | 'any', (state: KeyState, holdTime?: number) => void> = new Map();
    private static keysDown: Map<InputKey | 'any', number> = new Map();

    public static init() {
        mp.events.add('render', this.onRender.bind(this));
    }

    private static triggerEvent(key: InputKey, state: KeyState, holdTime?: number) {
        this.keyHandlers.get(key)?.(state, holdTime);
        this.keyHandlers.get('any')?.(state, holdTime);
    }

    private static onRender() {
        const keysToCheck = Array.from(this.keyHandlers.keys()).filter(k => k !== 'any') as InputKey[];
        const currentTime = Date.now();

        keysToCheck.forEach((key) => {
            const isKeyDown = mp.keys.isDown(getKeyCode(key));
            const wasKeyDown = this.keysDown.has(key);

            if (isKeyDown && !wasKeyDown) {
                this.keysDown.set(key, currentTime);
                this.triggerEvent(key, KeyState.Down, 0);
            } else if (!isKeyDown && wasKeyDown) {
                const holdTime = currentTime - (this.keysDown.get(key) || currentTime);
                this.keysDown.delete(key);
                this.triggerEvent(key, KeyState.Up, holdTime);
            }
        });
    }

    public static registerKeyHandler(key: InputKey | 'any', handler: (state: KeyState, holdTime?: number) => void) {
        this.keyHandlers.set(key, handler);
    }

    public static unregisterKeyHandler(key: InputKey | 'any') {
        this.keyHandlers.delete(key);
    }
}