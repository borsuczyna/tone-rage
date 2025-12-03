import styles from '../../Styles/ChatInterface.module.css';
import type { CommandSnippet, CommandParameter } from '@shared/Models/CommandSnippet';

interface CommandSnippetsProps {
    snippets: CommandSnippet[];
    currentParamIndex?: number;
    invalidParamIndex?: number;
}

function getParameterTypeColor(type: CommandParameter['type']): string {
    switch (type) {
        case 'number':
            return '#4CAF50';
        case 'player':
            return '#2196F3';
        case 'string':
            return '#FFC107';
        case 'rest':
            return '#9C27B0';
        default:
            return '#757575';
    }
}

export default function CommandSnippets({ 
    snippets, 
    currentParamIndex = -1,
    invalidParamIndex
}: CommandSnippetsProps) {
    if (snippets.length === 0) {
        return null;
    }

    return (
        <div className={styles.commandSnippets}>
            {snippets.map((snippet, idx) => (
                <div key={idx} className={styles.commandSnippet}>
                    <div className={styles.commandName}>/{snippet.command}</div>
                    <div className={styles.commandParams}>
                        {snippet.parameters.map((param, paramIdx) => {
                            const isInvalid = invalidParamIndex !== undefined && paramIdx === invalidParamIndex;
                            const isCurrent = paramIdx === currentParamIndex;
                            
                            return (
                                <div 
                                    key={paramIdx} 
                                    className={`${styles.commandParam} ${isInvalid ? styles.invalidParam : ''} ${isCurrent ? styles.currentParam : ''}`}
                                    style={{
                                        borderColor: isInvalid ? '#f44336' : getParameterTypeColor(param.type)
                                    }}
                                >
                                    <span className={styles.paramName}>{param.name}</span>
                                    <span 
                                        className={styles.paramType}
                                        style={{ color: isInvalid ? '#f44336' : getParameterTypeColor(param.type) }}
                                    >
                                        {param.type}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {snippet.description && (
                        <div className={styles.commandDescription}>{snippet.description}</div>
                    )}
                </div>
            ))}
        </div>
    );
}
