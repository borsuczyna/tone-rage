import { reactive, readonly } from 'vue';
import { useRageEvent } from './RageEventProvider';
import type { ChatMessageData } from '@shared/Models/Chat';

interface ChatState {
    messages: ChatMessageData[];
    messageHistory: string[];
    historyIndex: number;
}

const state = reactive<ChatState>({
    messages: [],
    messageHistory: [],
    historyIndex: -1
});

function addMessage(message: ChatMessageData) {
    const lastMessage = state.messages[state.messages.length - 1];
    if (
        lastMessage &&
        lastMessage.messages.length < 5 &&
        lastMessage.username === message.username &&
        lastMessage.avatar === message.avatar &&
        JSON.stringify(lastMessage.emblemas) === JSON.stringify(message.emblemas)
    ) {
        const updatedLastMessage: ChatMessageData = {
            ...lastMessage,
            messages: [...lastMessage.messages, ...message.messages]
        };
        state.messages = [...state.messages.slice(0, -1), updatedLastMessage].slice(-150);
    } else {
        state.messages = [...state.messages, message].slice(-150);
    }
}

function clearMessages() {
    state.messages = [];
}

function addToHistory(message: string) {
    if (message.trim()) {
        // Don't add if it's the same as the last message
        if (state.messageHistory.length > 0 && state.messageHistory[state.messageHistory.length - 1] === message) {
            return;
        }
        // Limit history to last 100 messages
        state.messageHistory = [...state.messageHistory, message].slice(-100);
    }
}

function setHistoryIndex(index: number) {
    state.historyIndex = index;
}

// Initialize event listener
export function initChatProvider() {
    useRageEvent('chat:receiveMessage', (message: ChatMessageData) => {
        addMessage(message);
    });
}

export function useChat() {
    return {
        messages: readonly(state.messages),
        addMessage,
        clearMessages,
        messageHistory: readonly(state.messageHistory),
        addToHistory,
        historyIndex: readonly(() => state.historyIndex),
        setHistoryIndex
    };
}
