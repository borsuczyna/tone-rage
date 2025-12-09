export interface WorldInteractionItem {
    icon: string;
    label: string;
}

export interface WorldInteractionHandler extends WorldInteractionItem {
    action: () => void;
    priority?: number;
}

export type WorldInteractionListener = () => WorldInteractionHandler | WorldInteractionHandler[] | null;