import { useRef, useState } from 'react';
import styles from './Styles/Toolbar.module.css';
import { type CharacterAppearance, validateCharacterAppearance } from '@shared/Models/Character/Character';
import { ArrowDownToLine, ArrowUpToLine, Check, Loader2, RefreshCcw } from 'lucide-react';
import { useNotifications } from 'src/Hooks/NotificationsProvider';
import Modal from '../Modal';
import Button from '../Button';

interface ToolbarProps {
    characterAppearance: CharacterAppearance;
    randomizeAppearance: () => void;
    onFullUpdate: (appearance: CharacterAppearance) => void;
    saveCharacter: () => void;
    isSaving: boolean;
}

export default function Toolbar({ characterAppearance, randomizeAppearance, onFullUpdate, saveCharacter, isSaving }: ToolbarProps) {
    const { addNotification } = useNotifications();
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pasteValue, setPasteValue] = useState('');
    
    // Base64 encoding/decoding with additional obfuscation
    const encodeAppearance = (appearance: CharacterAppearance): string => {
        const jsonString = JSON.stringify(appearance);
        const encoded = btoa(jsonString);
        // Add simple obfuscation by reversing and adding prefix/suffix
        return `CC_${encoded.split('').reverse().join('')}_DATA`;
    };

    const decodeAppearance = (encodedData: string): CharacterAppearance | null => {
        try {
            // Remove prefix/suffix and reverse
            if (!encodedData.startsWith('CC_') || !encodedData.endsWith('_DATA')) {
                return null;
            }
            const cleaned = encodedData.slice(3, -5); // Remove CC_ and _DATA
            const reversed = cleaned.split('').reverse().join('');
            const decoded = atob(reversed);
            const appearance = JSON.parse(decoded) as CharacterAppearance;
            
            // Validate the decoded appearance
            const [isValid] = validateCharacterAppearance(appearance);
            if (isValid) {
                return appearance;
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const saveToClipboard = async () => {
        try {
            const encoded = encodeAppearance(characterAppearance);
            
            // Use invisible input method for better compatibility
            if (hiddenInputRef.current) {
                hiddenInputRef.current.value = encoded;
                hiddenInputRef.current.select();
                hiddenInputRef.current.setSelectionRange(0, 99999); // For mobile devices
                
                const successful = document.execCommand('copy');
                if (successful) {
                    showFeedback('Character saved to clipboard!', 'success');
                } else {
                    showFeedback('Failed to save to clipboard', 'error');
                }
            }
        } catch (error) {
            showFeedback('Failed to save to clipboard', 'error');
        }
    };

    const loadFromClipboard = async () => {
        try {
            setPasteValue('');
            setIsModalOpen(true);
        } catch (error) {
            showFeedback('Failed to load character data', 'error');
        }
    };

    const processLoadedData = (data: string) => {
        if (!data.trim()) {
            showFeedback('No data provided', 'error');
            return;
        }
        
        const decoded = decodeAppearance(data);
        
        if (decoded) {
            onFullUpdate(decoded);
            showFeedback('Character loaded successfully!', 'success');
            setIsModalOpen(false);
        } else {
            showFeedback('Invalid character data', 'error');
        }
    };

    const handleModalLoad = () => {
        processLoadedData(pasteValue);
    };

    const showFeedback = (message: string, type: 'success' | 'error') => {
        addNotification('Character Creator', message, type);
    };

    return (
        <>
            <div className={styles.toolbar}>
                {/* Hidden input for clipboard operations */}
                <input 
                    ref={hiddenInputRef}
                    style={{ 
                        position: 'absolute', 
                        left: '-9999px', 
                        opacity: 0, 
                        pointerEvents: 'none' 
                    }}
                    readOnly
                />
                
                <button 
                    className={`${styles.button}`}
                    onClick={randomizeAppearance}
                    title="Randomize character appearance"
                >
                    <RefreshCcw />
                </button>
                
                <button 
                    className={`${styles.button}`}
                    onClick={saveToClipboard}
                    title="Save character to clipboard"
                >
                    <ArrowDownToLine />
                </button>
                
                <button 
                    className={`${styles.button}`}
                    onClick={loadFromClipboard}
                    title="Load character from clipboard"
                >
                    <ArrowUpToLine />
                </button>
                
                <button 
                    className={`${styles.button}`}
                    onClick={!isSaving ? saveCharacter : undefined}
                    title="Save character"
                    disabled={isSaving}
                >
                    {isSaving ? 
                        <Loader2 className={styles.spinner} /> :
                        <Check />
                    }
                </button>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Load Character Data"
            >
                <div className={styles.modalContent}>
                    <p className={styles.modalDescription}>
                        Paste your character data below:
                    </p>
                    <textarea 
                        value={pasteValue}
                        onChange={(e) => setPasteValue(e.target.value)}
                        placeholder="Paste character data here..."
                        className={styles.modalTextarea}
                        rows={4}
                    />
                    <div className={styles.modalButtons}>
                        <Button
                            variant='glass'
                            size='small'
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant='primary'
                            size='small'
                            onClick={handleModalLoad}
                            disabled={!pasteValue.trim()}
                        >
                            Load Character
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}