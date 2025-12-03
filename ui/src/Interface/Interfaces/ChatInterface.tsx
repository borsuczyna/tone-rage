import { useState } from 'react';
import ChatMessage from './Components/Chat/ChatMessage';
import styles from './Styles/ChatInterface.module.css';
import { useRef, useEffect } from 'react';
import ChatInput from './Components/Chat/ChatInput';
import type { ChatSettings } from './Components/Chat/types';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import { triggerEvent } from 'src/Hooks/Fetch';
import { useChat } from 'src/Hooks/ChatProvider';
import { type CommandSnippet } from '@shared/Models/CommandSnippets';

export default function ChatInterface() {
    const [inputOpen, setInputOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [commandSnippets, setCommandSnippets] = useState<CommandSnippet[]>([]);
    const { messages } = useChat();

    const [chatSettings, setChatSettings] = useState<ChatSettings>({
        width: 45,
        height: 17,
        zoom: 1.1,
        showAvatars: true
    });

    useRageEvent('chat:openChatInput', ([message, commandSnippets]: [string, CommandSnippet[]]) => {
        setInputOpen(true);
        setInputValue(message);
        setCommandSnippets(commandSnippets);
    });

    const handleSendMessage = (message: string) => {
        setInputValue('');
        setInputOpen(false);
        triggerEvent('chat:sendMessage', message);
    };

    const handleCloseInput = () => {
        triggerEvent('chat:closeChatInput');
        setInputOpen(false);
        setInputValue('');
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
            />
        </div>
    )
}