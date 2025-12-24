import { getTwemojiHtml } from '../Twemoji';
import csx from 'src/Utils/MergeClass';
export function richTextToHtml(elements) {
    const elementsArray = Array.isArray(elements) ? elements : [elements];
    return elementsArray.map(el => {
        if (typeof el === 'string') {
            return el;
        }
        else if (el.type === 'text') {
            let text = el.text;
            if (el.bold)
                text = `<strong>${text}</strong>`;
            if (el.italic)
                text = `<em>${text}</em>`;
            if (el.underline)
                text = `<u>${text}</u>`;
            return text;
        }
        else if (el.type === 'emoji') {
            return getTwemojiHtml(el.emoji, '1.2em');
        }
        else if (el.type === 'html') {
            return el.html;
        }
    }).join('');
}
export default function RichText({ elements, className, style }) {
    return <span className={csx(className, 'rich-text')} style={style} dangerouslySetInnerHTML={{ __html: richTextToHtml(elements) }}></span>;
}
