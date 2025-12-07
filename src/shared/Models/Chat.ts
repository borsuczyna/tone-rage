import type { Emblema } from './Emblema';
import type { RichTextData } from './RichTextModels';

export interface ChatMessageData {
	avatar?: string;
	username: string;
	messages: RichTextData[];
	emblemas?: Emblema[]; // Use same type as scoreboard
}
