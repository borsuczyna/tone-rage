import { writable } from 'svelte/store';
function createChatStore() {
    const { subscribe, update } = writable({
        messages: [],
        messageHistory: [],
        historyIndex: -1,
    });
    const addMessage = (message) => {
        update(store => {
            const lastMessage = store.messages[store.messages.length - 1];
            if (lastMessage && lastMessage.messages.length < 5 &&
                lastMessage.username === message.username &&
                lastMessage.avatar === message.avatar &&
                JSON.stringify(lastMessage.emblemas) === JSON.stringify(message.emblemas)) {
                const updatedLastMessage = {
                    ...lastMessage,
                    messages: [...lastMessage.messages, ...message.messages]
                };
                return {
                    ...store,
                    messages: [...store.messages.slice(0, -1), updatedLastMessage].slice(-150)
                };
            }
            else {
                return {
                    ...store,
                    messages: [...store.messages, message].slice(-150)
                };
            }
        });
    };
    const clearMessages = () => {
        update(store => ({ ...store, messages: [] }));
    };
    const addToHistory = (message) => {
        if (message.trim()) {
            update(store => {
                // Don't add if it's the same as the last message
                if (store.messageHistory.length > 0 &&
                    store.messageHistory[store.messageHistory.length - 1] === message) {
                    return store;
                }
                // Limit history to last 100 messages
                return {
                    ...store,
                    messageHistory: [...store.messageHistory, message].slice(-100)
                };
            });
        }
    };
    const setHistoryIndex = (index) => {
        update(store => ({ ...store, historyIndex: index }));
    };
    return {
        subscribe,
        addMessage,
        clearMessages,
        addToHistory,
        setHistoryIndex,
    };
}
export const chat = createChatStore();
