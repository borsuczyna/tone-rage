import { useState } from 'react';
import ChatMessage, { type ChatMessageData } from './Components/Chat/ChatMessage';
import styles from './Styles/ChatInterface.module.css';
import { useRef, useEffect } from 'react';
import ChatInput from './Components/Chat/ChatInput';
import type { ChatSettings } from './Components/Chat/types';

export default function ChatInterface() {
    const [inputOpen, setInputOpen] = useState<boolean>(false);
    const [chatSettings, setChatSettings] = useState<ChatSettings>({
        width: 45,
        height: 17,
        zoom: 1,
        showAvatars: true
    });
    const [messages] = useState<ChatMessageData[]>([
        { 
            username: 'System',
            messages: ["Welcome to the chat!"] 
        },
        { 
            username: 'User', 
            messages: ["This is a sample message."]
        },
        { 
            avatar: 'https://cdn.discordapp.com/avatars/1250137230920388640/0cd4baa90fef2f0a2b700c30c757f39c.gif?size=1024', 
            username: 'borsuczyna',
            emblemas: ['premium', 'admin-administrator'],
            messages: [
                "Feel free to add more messages.", 
                [
                    {
                        type: 'text',
                        text: 'This is a rich text message with ',
                    },
                    {
                        type: 'text',
                        text: 'bold',
                        bold: true
                    },
                    {
                        type: 'text',
                        text: ', italic, and ',
                        italic: true
                    },
                    {
                        type: 'text',
                        text: 'underline',
                        underline: true
                    },
                    {
                        type: 'emoji',
                        emoji: '🚞'
                    },
                    {
                        type: 'emoji',
                        emoji: '😄'
                    },
                    {
                        type: 'emoji',
                        emoji: '🔥'
                    },
                    {
                        type: 'emoji',
                        emoji: '🚞'
                    },
                    {
                        type: 'emoji',
                        emoji: '😄'
                    },
                    {
                        type: 'emoji',
                        emoji: '🔥'
                    },
                    {
                        type: 'emoji',
                        emoji: '🚞'
                    },
                    {
                        type: 'emoji',
                        emoji: '😄'
                    },
                    {
                        type: 'emoji',
                        emoji: '🔥'
                    },
                    {
                        type: 'text',
                        text: ' emojis!',
                    }
                ],
                "Feel free to add more messages.", 
                "Lorem ipsum dolor sit amet cwetetur adipiscing elit gsed do eiusmod tempor incididunt ut labore et dolore magna aliqua gsed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis"
            ] 
        },
        { 
            username: 'AnotherUser', 
            messages: ["Here's another message.", "And one more for good measure."]
        }
    ]);

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
                onClick={() => setInputOpen(!inputOpen)}
                className={styles.chatContainer}
                ref={chatContainerRef}
                onScroll={checkIfAtBottom}
            >
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
            </div>
            <ChatInput open={inputOpen} onSettingsChange={setChatSettings} />
        </div>
    )
}