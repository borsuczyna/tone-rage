import { useState } from 'react';
import ChatMessage from './Components/Chat/ChatMessage';
import styles from './Styles/ChatInterface.module.css';
import { useRef, useEffect } from 'react';
import ChatInput from './Components/Chat/ChatInput';
import type { ChatSettings } from './Components/Chat/types';
import { useRageEvent } from 'src/Hooks/RageEventProvider';
import { triggerEvent } from 'src/Hooks/Fetch';
import type { ChatMessageData } from '@shared/Models/Chat';
import type { CommandSnippet } from '@shared/Models/CommandSnippet';

export default function ChatInterface() {
    const [inputOpen, setInputOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [chatSettings, setChatSettings] = useState<ChatSettings>({
        width: 45,
        height: 17,
        zoom: 1.1,
        showAvatars: true
    });
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [commandSnippets, setCommandSnippets] = useState<CommandSnippet[]>([]);

    useRageEvent('chat:openChatInput', (message: string) => {
        setInputOpen(true);
        setInputValue(message);
    });

    useRageEvent('chat:receiveMessage', (message: ChatMessageData) => {
        setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && lastMessage.messages.length < 5 && lastMessage.username === message.username && lastMessage.avatar === message.avatar &&
                JSON.stringify(lastMessage.emblemas) === JSON.stringify(message.emblemas)) {
                const updatedLastMessage: ChatMessageData = {
                    ...lastMessage,
                    messages: [...lastMessage.messages, ...message.messages]
                };
                return [...prevMessages.slice(0, -1), updatedLastMessage];
            } else {
                return [...prevMessages, message];
            }
        });
    });

    useRageEvent('chat:setCommandSnippets', (snippets: CommandSnippet[]) => {
        setCommandSnippets(snippets);
    });

    const handleSendMessage = (message: string) => {
        triggerEvent('chat:sendMessage', message);
        setInputValue('');
        setInputOpen(false);
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
            scrollToBottom();
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
                onSettingsChange={setChatSettings}
                onSend={handleSendMessage}
                onClose={handleCloseInput}
                commandSnippets={commandSnippets}
            />
        </div>
    )
}