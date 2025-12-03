import translate from '@shared/Translation/Translation';
import styles from '../../Styles/ChatInterface.module.css';
import { Smile, Settings } from 'lucide-react';
import EmojiPicker from '../EmojiPicker';
import ChatSettings from './ChatSettings';
import CommandSnippets from './CommandSnippets';
import type { ChatSettings as ChatSettingsType } from './types';
import { useState, useRef, useEffect } from 'react';
import SharedConfig from '@shared/SharedConfig';
import type { CommandSnippet } from '@shared/Models/CommandSnippet';
import { parseCommandInput, getCurrentParameterIndex } from '@shared/Models/CommandSnippet';

interface ChatInputProps {
    open: boolean;
    value: string;
    onChange: (value: string) => void;
    onSettingsChange?: (settings: ChatSettingsType) => void;
    onSend?: (message: string) => void;
    onClose?: () => void;
    commandSnippets?: CommandSnippet[];
}

export default function ChatInput({
    open,
    value,
    onChange,
    onSettingsChange,
    onSend,
    onClose,
    commandSnippets = []
}: ChatInputProps) {
    const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(open);
    const [animationState, setAnimationState] = useState<'fadeIn' | 'fadeOut' | 'visible' | 'hidden'>(open ? 'visible' : 'hidden');
    const [settings, setSettings] = useState<ChatSettingsType>({
        width: 45,
        height: 17,
        zoom: 1,
        showAvatars: true
    });
    const [showSnippets, setShowSnippets] = useState<boolean>(false);
    const [matchingSnippets, setMatchingSnippets] = useState<CommandSnippet[]>([]);
    const [invalidParamIndex, setInvalidParamIndex] = useState<number | undefined>(undefined);
    const [currentParamIndex, setCurrentParamIndex] = useState<number>(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const onEmojiSelect = (emoji: string, event?: MouseEvent) => {
        const newValue = value.slice(0, cursorPosition) + emoji + value.slice(cursorPosition);
        onChange(newValue);

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
        const newValue = e.target.value;
        onChange(newValue);
        updateCommandSnippets(newValue, e.target.selectionStart || 0);
    }

    const handleSelectionChange = () => {
        if (inputRef.current) {
            const newCursorPos = inputRef.current.selectionStart || 0;
            setCursorPosition(newCursorPos);
            updateCommandSnippets(value, newCursorPos);
        }
    }

    const updateCommandSnippets = (inputValue: string, cursorPos: number) => {
        const trimmed = inputValue.trim();
        
        // Only show snippets if input starts with /
        if (!trimmed.startsWith('/')) {
            setShowSnippets(false);
            setMatchingSnippets([]);
            setInvalidParamIndex(undefined);
            setCurrentParamIndex(-1);
            return;
        }

        // Get command part (first word after /)
        const parts = trimmed.slice(1).split(/\s+/);
        const commandName = parts[0] || '';

        // Find matching snippets
        const matches = commandSnippets.filter(snippet =>
            snippet.command.toLowerCase().startsWith(commandName.toLowerCase())
        );

        if (matches.length === 0) {
            setShowSnippets(false);
            setMatchingSnippets([]);
            setInvalidParamIndex(undefined);
            setCurrentParamIndex(-1);
            return;
        }

        // Find exact match for validation
        const exactMatch = commandSnippets.find(snippet =>
            snippet.command.toLowerCase() === commandName.toLowerCase()
        );

        if (exactMatch) {
            // Validate the input
            const parsed = parseCommandInput(trimmed, exactMatch);
            setInvalidParamIndex(parsed.invalidParamIndex);
            setCurrentParamIndex(getCurrentParameterIndex(trimmed, cursorPos));
            setMatchingSnippets([exactMatch]);
        } else {
            // Show all matching commands
            setInvalidParamIndex(undefined);
            setCurrentParamIndex(-1);
            setMatchingSnippets(matches);
        }

        setShowSnippets(true);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSend?.(value);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose?.();
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
                    // Check for command snippets if value starts with /
                    if (value.trim().startsWith('/')) {
                        updateCommandSnippets(value, inputRef.current.selectionStart || 0);
                    }
                }
            }, 300);
            return () => clearTimeout(timer);
        } else {
            // Start fade-out animation
            setAnimationState('fadeOut');
            // Reset snippet state
            setShowSnippets(false);
            setMatchingSnippets([]);
            setInvalidParamIndex(undefined);
            setCurrentParamIndex(-1);
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
            <div className={getClassName()} style={{ position: 'relative' }}>
                {showSnippets && matchingSnippets.length > 0 && (
                    <CommandSnippets 
                        snippets={matchingSnippets}
                        currentParamIndex={currentParamIndex}
                        invalidParamIndex={invalidParamIndex}
                    />
                )}
                <input 
                    ref={inputRef}
                    className={styles.chatInput} 
                    placeholder={translate('chat.input.placeholder')}
                    value={value}
                    onChange={handleInputChange}
                    onSelect={handleSelectionChange}
                    onClick={handleSelectionChange}
                    onKeyUp={handleSelectionChange}
                    onKeyDown={handleKeyDown}
                    maxLength={SharedConfig.MaxChatMessageLength}
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