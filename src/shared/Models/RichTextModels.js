export function parseRichText(message) {
    try {
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
        const parts = message.split(emojiRegex);
        const richTextData = [];
        for (const part of parts) {
            if (emojiRegex.test(part)) {
                richTextData.push({ type: 'emoji', emoji: part });
            }
            else if (part.length > 0) {
                // Parse text formatting (bold, italic, underline)
                const textParts = parseTextFormatting(part);
                richTextData.push(...textParts);
            }
        }
        return richTextData;
    }
    catch (error) {
        console.error('Error parsing rich text:', error);
        return null;
    }
}
function parseTextFormatting(text) {
    const out = [];
    // match ** or __ first, then single *
    const firstMarker = text.match(/(\*\*|__|\*)/);
    if (!firstMarker) {
        // no markers -> plain text
        return text.length > 0 ? [{ type: 'text', text }] : [];
    }
    const marker = firstMarker[1];
    const start = firstMarker.index ?? 0;
    const endIdx = text.indexOf(marker, start + marker.length);
    // if no closing marker, treat whole string as plain
    if (endIdx === -1) {
        return [{ type: 'text', text }];
    }
    // text before marker
    if (start > 0) {
        out.push({ type: 'text', text: text.slice(0, start) });
    }
    // inner text between the matched markers -> parse recursively
    const inner = text.slice(start + marker.length, endIdx);
    const innerParts = parseTextFormatting(inner); // recursion
    // apply this marker's formatting to inner parts
    for (const p of innerParts) {
        if (p.type === 'text') {
            const formatted = { type: 'text', text: p.text };
            if (marker === '**')
                formatted.bold = true;
            if (marker === '*')
                formatted.italic = true;
            if (marker === '__')
                formatted.underline = true;
            // preserve any nested flags from recursion
            if (p.bold)
                formatted.bold = true;
            if (p.italic)
                formatted.italic = true;
            if (p.underline)
                formatted.underline = true;
            out.push(formatted);
        }
        else {
            out.push(p);
        }
    }
    // remainder after the closing marker -> parse recursively
    const rest = text.slice(endIdx + marker.length);
    if (rest.length > 0) {
        out.push(...parseTextFormatting(rest));
    }
    return out;
}
