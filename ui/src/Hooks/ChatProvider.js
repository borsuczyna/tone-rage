import { createContext, useContext, useState, useCallback } from 'react';
import { useRageEvent } from './RageEventProvider';
const ChatContext = createContext(undefined);
export function ChatProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [messageHistory, setMessageHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const addMessage = (message) => {
        setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && lastMessage.messages.length < 5 && lastMessage.username === message.username && lastMessage.avatar === message.avatar &&
                JSON.stringify(lastMessage.emblemas) === JSON.stringify(message.emblemas)) {
                const updatedLastMessage = {
                    ...lastMessage,
                    messages: [...lastMessage.messages, ...message.messages]
                };
                return [...prevMessages.slice(0, -1), updatedLastMessage].slice(-150);
            }
            else {
                return [...prevMessages, message].slice(-150);
            }
        });
    };
    const clearMessages = () => {
        setMessages([]);
    };
    const addToHistory = (message) => {
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
    useRageEvent('chat:receiveMessage', useCallback((message) => {
        addMessage(message);
    }, [addMessage]));
    const value = {
        messages,
        addMessage,
        clearMessages,
        messageHistory,
        addToHistory,
        historyIndex,
        setHistoryIndex,
    };
    return (<ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>);
}
export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
