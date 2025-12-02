import { useState, useRef, useEffect } from 'react';
import Twemoji from './Twemoji';
import { emojiCategories } from '@shared/Emojis';
import styles from './EmojiPicker.module.css';

interface EmojiPickerProps {
    onEmojiSelect?: (emoji: string, event?: MouseEvent) => void;
    onClose?: () => void;
    style?: React.CSSProperties;
    anchor?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export default function EmojiPicker({ 
    onEmojiSelect,
    onClose,
    style,
    anchor = 'center',
}: EmojiPickerProps) {
    const [activeCategory, setActiveCategory] = useState<number>(0);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                if (onClose) {
                    onClose();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handlePickerClick = (event: React.MouseEvent) => {
        // Prevent event propagation to stop the click from bubbling up
        event.stopPropagation();
    };

    const handleEmojiClick = (emoji: string, event: React.MouseEvent) => {
        if (onEmojiSelect) {
            onEmojiSelect(emoji, event.nativeEvent);
        }
    };

    const getAnchorClass = () => {
        switch (anchor) {
            case 'top': return styles.anchorTop;
            case 'bottom': return styles.anchorBottom;
            case 'left': return styles.anchorLeft;
            case 'right': return styles.anchorRight;
            case 'top-left': return styles.anchorTopLeft;
            case 'top-right': return styles.anchorTopRight;
            case 'bottom-left': return styles.anchorBottomLeft;
            case 'bottom-right': return styles.anchorBottomRight;
            case 'center':
            default:
                return styles.anchorCenter;
        }
    };

    return (
        <div 
            ref={emojiPickerRef}
            className={`${styles.emojiPicker} ${getAnchorClass()}`} 
            style={style}
            onClick={handlePickerClick}
        >
            {/* Category tabs */}
            <div className={styles.categoryTabs}>
                {emojiCategories.map((category, index) => (
                    <div
                        key={index}
                        className={`${styles.categoryTab} ${activeCategory === index ? styles.active : ''}`}
                        onClick={() => setActiveCategory(index)}
                    >
                        <Twemoji emoji={category.symbol} />
                    </div>
                ))}
            </div>

                {/* Emoji grid */}
                <div className={styles.emojiGrid}>
                    {emojiCategories[activeCategory]?.emojis.map((emoji, index) => (
                        <div
                            key={index}
                            className={styles.emojiItem}
                            onClick={(event) => handleEmojiClick(emoji, event)}
                            title={emoji}
                        >
                            <Twemoji emoji={emoji} />
                        </div>
                    ))}
                </div>
            </div>
    );
}