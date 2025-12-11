import { createContext, useContext, useState } from 'react';
import { useRageEvent } from './RageEventProvider';
import type { ReactNode } from 'react';
import type { ChatMessageData } from '@shared/Models/Chat';

interface ChatContextType {
    messages: ChatMessageData[];
    addMessage: (message: ChatMessageData) => void;
    clearMessages: () => void;
    messageHistory: string[];
    addToHistory: (message: string) => void;
    historyIndex: number;
    setHistoryIndex: (index: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    const addMessage = (message: ChatMessageData) => {
        setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && lastMessage.messages.length < 5 && lastMessage.username === message.username && lastMessage.avatar === message.avatar &&
                JSON.stringify(lastMessage.emblemas) === JSON.stringify(message.emblemas)) {
                const updatedLastMessage: ChatMessageData = {
                    ...lastMessage,
                    messages: [...lastMessage.messages, ...message.messages]
                };
                return [...prevMessages.slice(0, -1), updatedLastMessage].slice(-150);
            } else {
                return [...prevMessages, message].slice(-150);
            }
        });
    };

    const clearMessages = () => {
        setMessages([]);
    };

    const addToHistory = (message: string) => {
        if (message.trim()) {
            setMessageHistory(prev => [...prev, message]);
        }
    };

    // Listen for new messages from RageMP
    useRageEvent('chat:receiveMessage', (message: ChatMessageData) => {
        addMessage(message);
    });

    const value: ChatContextType = {
        messages,
        addMessage,
        clearMessages,
        messageHistory,
        addToHistory,
        historyIndex,
        setHistoryIndex,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat(): ChatContextType {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}