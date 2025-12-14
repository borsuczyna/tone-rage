import { WorldInteractionItem } from '@shared/Models/WorldInteraction';

export interface WorldInteractionHandler extends WorldInteractionItem {
    action: () => void;
    entity: EntityMp;
    priority?: number;
}

export type WorldInteractionHandlerWithIndex = WorldInteractionHandler & { index: number };

export type WorldInteractionListener = () => WorldInteractionHandler | WorldInteractionHandler[] | null;