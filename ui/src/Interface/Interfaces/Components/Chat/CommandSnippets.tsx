import csx from 'src/Utils/MergeClass';
import styles from '../../Styles/ChatInterface.module.css';
import { validateParam, type CommandSnippet } from "@shared/Models/CommandSnippets";
import { useRef, useEffect } from 'react';

interface CommandSnippetsProps {
    commandSnippets: CommandSnippet[];
    value: string;
    setCommand: (value: string) => void;
    selectedIndex: number;
    onSelect: (index: number) => void;
}

interface CommandSnippetItemProps {
    snippet: CommandSnippet;
    currentParam: number | null;
    paramsValidation: boolean[];
    setCommand: (value: string) => void;
    isSelected: boolean;
    index: number;
    onSelect: (index: number) => void;
    onRef: (index: number, el: HTMLDivElement | null) => void;
}

function CommandSnippetItem({ snippet, currentParam, paramsValidation, setCommand, isSelected, index, onSelect, onRef }: CommandSnippetItemProps) {
    return (
        <div 
            ref={(el) => onRef(index, el)}
            className={csx(
                styles.commandSnippetItem,
                isSelected ? styles.commandSnippetItemSelected : null
            )} 
            onClick={() => setCommand(snippet.command)}
            onMouseEnter={() => onSelect(index)}
        >
            <div className={styles.commandSnippetHeader}>
                <div className={styles.commandSnippetCommand}>
                    <span className={styles.commandSnippetCommandText}>{snippet.command}</span>
                    {snippet.params && snippet.params.map((param, index) => (
                        <span key={index} className={
                            csx(
                                styles.commandSnippetParam,
                                currentParam === index ? styles.commandSnippetParamActive : null,
                                paramsValidation[index] == false ? styles.commandSnippetParamInvalid : paramsValidation[index] == true ? styles.commandSnippetParamValid : null
                            )
                        }>
                            {param.name}
                        </span>
                    ))}
                </div>
            </div>
            {snippet.description && (
                <div className={styles.commandSnippetDescription}>
                    {snippet.description}
                </div>
            )}
        </div>
    );
}

export default function CommandSnippets({
    commandSnippets,
    value,
    setCommand,
    selectedIndex,
    onSelect
}: CommandSnippetsProps) {
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Scroll to selected item when selection changes
    useEffect(() => {
        if (selectedIndex >= 0 && selectedIndex < itemRefs.current.length && itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [selectedIndex]);

    const handleRef = (index: number, el: HTMLDivElement | null) => {
        itemRefs.current[index] = el;
    };

    if (value[0] !== '/') {
        return null;
    }

    const commandParams = value.split(' ');
    const commandName = commandParams[0].slice(1).toLowerCase();
    let matchedSnippets = commandSnippets.filter(snippet => snippet.command.slice(1).toLowerCase().startsWith(commandName));
    const paramsValidation: boolean[] = [];

    if (commandParams.length > 1) {
        matchedSnippets = commandSnippets.find(snippet => snippet.command.slice(1).toLowerCase() === commandName) ? [commandSnippets.find(snippet => snippet.command.slice(1).toLowerCase() === commandName)!] : [];

        for (let [index, param] of commandParams.slice(1).entries()) {
            const commandParam = matchedSnippets[0]?.params ? matchedSnippets[0].params[index] : null;
            if (commandParam) {
                const isValid = validateParam(commandParam.type, param);
                paramsValidation.push(isValid);
            }
        }
    }

    if (matchedSnippets.length === 0) {
        return null;
    }

    const currentParam: number | null = commandParams.length > 1 ? commandParams.length - 2 : null;

    return (
        <div className={styles.commandSnippets}>
            {matchedSnippets.map((snippet, index) => (
                <CommandSnippetItem 
                    key={index} 
                    snippet={snippet} 
                    currentParam={currentParam} 
                    paramsValidation={paramsValidation} 
                    setCommand={setCommand}
                    isSelected={selectedIndex === index}
                    index={index}
                    onSelect={onSelect}
                    onRef={handleRef}
                />
            ))}
        </div>
    )
}