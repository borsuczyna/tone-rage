import { createContext, useContext, useState, useCallback } from 'react';
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
            setMessageHistory(prev => {
                // Don't add if it's the same as the last message
                if (prev.length > 0 && prev[prev.length - 1] === message) {
                    return prev;
                }
                // Limit history to last 100 messages
                return [...prev, message].slice(-100);
            });
        }
    };

    // Listen for new messages from RageMP
    useRageEvent('chat:receiveMessage', useCallback((message: ChatMessageData) => {
        addMessage(message);
    }, [addMessage]));

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