export interface RichEmojiElement {
    type: 'emoji';
    emoji: string;
}

export interface RichTextElement {
    type: 'text';
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}

export interface RichTextHtmlElement {
    type: 'html';
    html: string;
}

export type RichTextElementType = RichTextElement | RichEmojiElement | RichTextHtmlElement;
export type RichTextData = string | string[] | RichTextElementType[];

export function parseRichText(message: string): RichTextData | null { // supports all twemojis, also fixes 👌👌, when two emotes are next to each other, old version didnt have it working
    try {
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
        const parts = message.split(emojiRegex);
        const richTextData: RichTextElementType[] = [];
        for (const part of parts) {
            if (emojiRegex.test(part)) {
                richTextData.push({ type: 'emoji', emoji: part });
            } else if (part.length > 0) {
                richTextData.push({ type: 'text', text: part });
            }
        }
        return richTextData;
    } catch (error) {
        console.error('Error parsing rich text:', error);
        return null;
    }
}