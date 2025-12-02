import SharedConfig from '@shared/SharedConfig';
import styles from '../../Styles/ChatInterface.module.css';
import RichText from '../RichText/RichText';
import EmblemaElement from '../EmblemaElement';
import type { RichTextData } from '@shared/Models/RichTextModels';
import type { Emblema } from '@shared/Models/Emblema';

export interface ChatMessageData {
    avatar?: string;
    username: string;
    messages: RichTextData[];
    emblemas?: Emblema[]; // Use same type as scoreboard
}

export default function ChatMessage({ message }: { message: ChatMessageData }) {
    const avatar = message.avatar || SharedConfig.DefaultAvatar;
    const messages = Array.isArray(message.messages) ? message.messages : [message.messages];

    return (
        <div className={styles.chatMessage}>
            <img src={avatar} className={styles.avatar} />
            <div className={styles.messageContent}>
                <div className={styles.usernameContainer}>
                    <span className={styles.username}>{message.username}</span>
                    {message.emblemas && message.emblemas.length > 0 && (
                        <div className={styles.emblemas}>
                            {message.emblemas.map((emblema) => (
                                <EmblemaElement 
                                    key={emblema} 
                                    emblema={emblema} 
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.messageContainer}>
                    {messages.map((msg, index) => {
                        const isFirst = index === 0;
                        const nextExists = index < messages.length - 1;
                        const previousExists = index > 0;
                        const style = [
                            styles.message,
                            isFirst ? styles.firstMessage : '',
                            nextExists ? styles.messageWithNext : '',
                            previousExists ? styles.messageWithPrevious : ''
                        ].filter(Boolean).join(' ');

                        return (
                            <RichText key={index} elements={typeof msg === 'string' ? [msg] : Array.isArray(msg) ? msg : [msg]} className={style} />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}