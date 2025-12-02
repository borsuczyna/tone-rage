import translate from '@shared/Translation/Translation';
import styles from '../../Styles/ChatInterface.module.css';
import { Smile, Settings } from 'lucide-react';
import EmojiPicker from '../EmojiPicker';
import ChatSettings from './ChatSettings';
import type { ChatSettings as ChatSettingsType } from './types';
import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
    open: boolean;
    onSettingsChange?: (settings: ChatSettingsType) => void;
}

export default function ChatInput({
    open,
    onSettingsChange
}: ChatInputProps) {
    const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(open);
    const [animationState, setAnimationState] = useState<'fadeIn' | 'fadeOut' | 'visible' | 'hidden'>(open ? 'visible' : 'hidden');
    const [settings, setSettings] = useState<ChatSettingsType>({
        width: 45,
        height: 17,
        zoom: 1,
        showAvatars: true
    });
    const inputRef = useRef<HTMLInputElement>(null);

    const onEmojiSelect = (emoji: string, event?: MouseEvent) => {
        const newValue = inputValue.slice(0, cursorPosition) + emoji + inputValue.slice(cursorPosition);
        setInputValue(newValue);

        // Don't close picker if shift key is held down
        if (!event || !event.shiftKey) {
            setEmojiPickerOpen(false);
        }
        
        // Set cursor position after emoji
        const newCursorPosition = cursorPosition + emoji.length;
        setCursorPosition(newCursorPosition);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
                inputRef.current.focus();
            }
        }, 0);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleSelectionChange = () => {
        if (inputRef.current) {
            setCursorPosition(inputRef.current.selectionStart || 0);
        }
    }

    useEffect(() => {
        if (open) {
            // Show the component immediately and start fade-in animation
            setIsVisible(true);
            setAnimationState('fadeIn');
            // After animation completes, set to visible state and focus input
            const timer = setTimeout(() => {
                setAnimationState('visible');
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 300);
            return () => clearTimeout(timer);
        } else {
            // Start fade-out animation
            setAnimationState('fadeOut');
            // After animation completes, hide from DOM
            const timer = setTimeout(() => {
                setIsVisible(false);
                setAnimationState('hidden');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const updateSettings = (newSettings: Partial<ChatSettingsType>) => {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        onSettingsChange?.(updatedSettings);
    };
    
    const getClassName = () => {
        const baseClass = styles.inputContainer;
        switch (animationState) {
            case 'fadeIn':
                return `${baseClass} ${styles.fadeIn}`;
            case 'fadeOut':
                return `${baseClass} ${styles.fadeOut}`;
            case 'visible':
                return baseClass;
            case 'hidden':
            default:
                return `${baseClass} ${styles.hidden}`;
        }
    };

    // Don't render if not visible
    if (!isVisible) {
        return null;
    }

    return (
        <>
            <div className={getClassName()}>
                <input 
                    ref={inputRef}
                    className={styles.chatInput} 
                    placeholder={translate('chat.input.placeholder')}
                    value={inputValue}
                    onChange={handleInputChange}
                    onSelect={handleSelectionChange}
                    onClick={handleSelectionChange}
                    onKeyUp={handleSelectionChange}
                />
                <div className={styles.emojiButton} onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>
                    <Smile size={'1.5rem'} />
                    {emojiPickerOpen && <EmojiPicker anchor='bottom' style={{ transform: 'translateX(-3rem)' }} onClose={() => setEmojiPickerOpen(false)} onEmojiSelect={onEmojiSelect} />}
                </div>
                <div className={styles.settingsButton} onClick={() => setSettingsOpen(true)}>
                    <Settings size={'1.5rem'} />
                </div>
            </div>
            
            <ChatSettings
                open={settingsOpen}
                settings={settings}
                onSettingsChange={updateSettings}
                onClose={() => setSettingsOpen(false)}
            />
        </>
    );
}