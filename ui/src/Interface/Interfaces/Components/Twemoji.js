const U200D = String.fromCharCode(8205);
const UFE0Fg = /\uFE0F/g;
export default function Twemoji({ emoji, size = '1.2em' }) {
    return <span className={`e-${grabTheRightIcon(emoji)} twemoji`} style={{ width: size, height: size }}></span>;
}
export function getTwemojiHtml(emoji, size = '1.2em') {
    return `<span class="e-${grabTheRightIcon(emoji)} twemoji" style="width: ${size}; height: ${size};"></span>`;
}
export function grabTheRightIcon(rawText) {
    return toCodePoint(rawText.indexOf(U200D) < 0 ? rawText.replace(UFE0Fg, "") : rawText);
}
export function toCodePoint(unicodeSurrogates, sep) {
    var r = [], c = 0, p = 0, i = 0;
    while (i < unicodeSurrogates.length) {
        c = unicodeSurrogates.charCodeAt(i++);
        if (p) {
            r.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
            p = 0;
        }
        else if (55296 <= c && c <= 56319) {
            p = c;
        }
        else {
            r.push(c.toString(16));
        }
    }
    return r.join(sep || "-");
}
