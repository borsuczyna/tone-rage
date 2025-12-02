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