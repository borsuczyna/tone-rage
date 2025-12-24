import translate from '@shared/Translation/Translation';
import styles from '../../Styles/ChatInterface.module.css';
import { Smile, Settings } from 'lucide-react';
import EmojiPicker from '../EmojiPicker';
import ChatSettings from './ChatSettings';
import { useState, useRef, useEffect } from 'react';
import SharedConfig from '@shared/SharedConfig';
import CommandSnippets from './CommandSnippets';
export default function ChatInput({ open, value, onChange, commandSnippets, settings, setSettings, onSend, onClose, onHistoryNavigation }) {
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [isVisible, setIsVisible] = useState(open);
    const [animationState, setAnimationState] = useState(open ? 'visible' : 'hidden');
    const [selectedSnippetIndex, setSelectedSnippetIndex] = useState(0);
    const inputRef = useRef(null);
    const onEmojiSelect = (emoji, event) => {
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
    };
    const handleInputChange = (e) => {
        onChange(e.target.value);
        setSelectedSnippetIndex(0); // Reset selection when typing
    };
    // Helper function to get filtered command snippets
    const getFilteredSnippets = () => {
        if (value[0] !== '/')
            return [];
        const commandParams = value.split(' ');
        const commandName = commandParams[0].slice(1).toLowerCase();
        let matchedSnippets = commandSnippets.filter(snippet => snippet.command.slice(1).toLowerCase().startsWith(commandName));
        if (commandParams.length > 1) {
            const exactMatch = commandSnippets.find(snippet => snippet.command.slice(1).toLowerCase() === commandName);
            matchedSnippets = exactMatch ? [exactMatch] : [];
        }
        return matchedSnippets;
    };
    const handleSelectionChange = () => {
        if (inputRef.current) {
            setCursorPosition(inputRef.current.selectionStart || 0);
        }
    };
    const handleKeyDown = (e) => {
        const filteredSnippets = getFilteredSnippets();
        if (e.key === 'Enter') {
            e.preventDefault();
            onSend?.(value);
        }
        else if (e.key === 'Escape') {
            e.preventDefault();
            onClose?.();
        }
        else if (e.key === 'ArrowUp') {
            if (filteredSnippets.length > 0) {
                e.preventDefault();
                setSelectedSnippetIndex(prev => prev <= 0 ? filteredSnippets.length - 1 : prev - 1);
            }
            else {
                e.preventDefault();
                onHistoryNavigation?.('up');
            }
        }
        else if (e.key === 'ArrowDown') {
            if (filteredSnippets.length > 0) {
                e.preventDefault();
                setSelectedSnippetIndex(prev => prev >= filteredSnippets.length - 1 ? 0 : prev + 1);
            }
            else {
                e.preventDefault();
                onHistoryNavigation?.('down');
            }
        }
        else if (e.key === 'Tab' && filteredSnippets.length > 0) {
            e.preventDefault();
            const selectedSnippet = filteredSnippets[selectedSnippetIndex];
            if (selectedSnippet) {
                setCommand(selectedSnippet.command);
            }
        }
    };
    const handleBlur = () => {
        // Refocus the input when it loses focus
        setTimeout(() => {
            if (inputRef.current && open) {
                inputRef.current.focus();
            }
        }, 0);
    };
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
        }
        else {
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
    // Reset selected index when filtered snippets change
    useEffect(() => {
        const filteredSnippets = getFilteredSnippets();
        if (selectedSnippetIndex >= filteredSnippets.length) {
            setSelectedSnippetIndex(0);
        }
    }, [value, commandSnippets]);
    const updateSettings = (newSettings) => {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
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
    const setCommand = (command) => {
        onChange(command + ' ');
        setTimeout(() => {
            if (inputRef.current) {
                const pos = command.length + 1;
                inputRef.current.setSelectionRange(pos, pos);
                inputRef.current.focus();
                setCursorPosition(pos);
            }
        }, 0);
    };
    // Don't render if not visible
    if (!isVisible) {
        return null;
    }
    return (<>
            <div className={getClassName()}>
                <input ref={inputRef} className={styles.chatInput} placeholder={translate('chat.input.placeholder')} value={value} onChange={handleInputChange} onSelect={handleSelectionChange} onClick={handleSelectionChange} onKeyUp={handleSelectionChange} onKeyDown={handleKeyDown} onBlur={handleBlur} maxLength={SharedConfig.MaxChatMessageLength}/>
                <div className={styles.emojiButton} onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>
                    <Smile size={'1.5rem'}/>
                    {emojiPickerOpen && <EmojiPicker anchor='bottom' style={{ transform: 'translate(-3rem, 3rem)' }} onClose={() => setEmojiPickerOpen(false)} onEmojiSelect={onEmojiSelect}/>}
                </div>
                <div className={styles.settingsButton} onClick={() => setSettingsOpen(true)}>
                    <Settings size={'1.5rem'}/>
                </div>
            </div>
            
            <ChatSettings open={settingsOpen} settings={settings} onSettingsChange={updateSettings} onClose={() => setSettingsOpen(false)}/>

            <CommandSnippets commandSnippets={commandSnippets} value={value} setCommand={setCommand} selectedIndex={selectedSnippetIndex} onSelect={setSelectedSnippetIndex}/>
        </>);
}
