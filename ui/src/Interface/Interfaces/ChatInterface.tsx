import { useState } from 'react';
import ChatMessage from './Components/Chat/ChatMessage';
import styles from './Styles/ChatInterface.module.css';
import { useRef, useEffect, useCallback } from 'react';
import ChatInput from './Components/Chat/ChatInput';
import type { ChatSettings } from './Components/Chat/types';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import { triggerEvent } from 'src/Hooks/Fetch';
import { useChat } from 'src/Hooks/ChatProvider';
import { type CommandSnippet } from '@shared/Models/CommandSnippets';

export default function ChatInterface() {
    const [inputOpen, setInputOpen] = useState<boolean>(false);
    const [inputValue, _setInputValue] = useState<string>('');
    const [commandSnippets, setCommandSnippets] = useState<CommandSnippet[]>([]);
    const { messages, messageHistory, historyIndex, setHistoryIndex, addToHistory } = useChat();

    const [chatSettings, setChatSettings] = useState<ChatSettings>({
        width: 45,
        height: 17,
        zoom: 1.1,
        showAvatars: true
    });

    const setInputValue = (value: string) => {
        if (!inputOpen) return;
        _setInputValue(value);
    };

    useRageEvent('chat:openChatInput', useCallback(([message, commandSnippets]: [string, CommandSnippet[]]) => {
        setInputOpen(true);
        setInputValue(message);
        setCommandSnippets(commandSnippets);
    }, []));

    const handleSendMessage = (message: string) => {
        addToHistory(message);
        setInputValue('');
        setInputOpen(false);
        setHistoryIndex(-1);
        triggerEvent('chat:sendMessage', message);
    };

    const handleCloseInput = () => {
        triggerEvent('chat:closeChatInput');
        setInputOpen(false);
        setInputValue('');
        setHistoryIndex(-1);
    };

    const handleHistoryNavigation = (direction: 'up' | 'down') => {
        if (messageHistory.length === 0) return;

        if (direction === 'up') {
            const newIndex = historyIndex === -1 
                ? messageHistory.length - 1 
                : Math.max(0, historyIndex - 1);
            setHistoryIndex(newIndex);
            setInputValue(messageHistory[newIndex]);
        } else {
            if (historyIndex === -1) return;
            
            const newIndex = historyIndex + 1;
            if (newIndex >= messageHistory.length) {
                setHistoryIndex(-1);
                setInputValue('');
            } else {
                setHistoryIndex(newIndex);
                setInputValue(messageHistory[newIndex]);
            }
        }
    };

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef<boolean>(true);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const checkIfAtBottom = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            isAtBottomRef.current = scrollTop + clientHeight >= scrollHeight - 5;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        if (isAtBottomRef.current) {
            setTimeout(() => {
                scrollToBottom();
            }, 0);
        }
    }, [messages]);

    return (
        <div 
            className={styles.main} 
            style={{
                '--chat-width': `${chatSettings.width}rem`,
                '--chat-height': `${chatSettings.height}rem`,
                '--chat-zoom': chatSettings.zoom,
                '--show-avatars': chatSettings.showAvatars ? '1' : '0'
            } as React.CSSProperties}
        >
            <div
                className={styles.chatContainer}
                ref={chatContainerRef}
                onScroll={checkIfAtBottom}
            >
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
            </div>

            <ChatInput 
                open={inputOpen} 
                value={inputValue} 
                onChange={setInputValue} 
                settings={chatSettings}
                setSettings={setChatSettings}
                onSend={handleSendMessage}
                onClose={handleCloseInput}
                commandSnippets={commandSnippets}
                onHistoryNavigation={handleHistoryNavigation}
            />
        </div>
    )
}