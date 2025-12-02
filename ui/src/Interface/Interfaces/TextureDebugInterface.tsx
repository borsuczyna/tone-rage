import { useState, useEffect } from 'react';
import TextureService from '../../Services/TextureService';
import styles from './Styles/TextureDebugInterface.module.css';

export default function TextureDebugInterface() {
    const [upperText, setUpperText] = useState('Upper Text');
    const [lowerText, setLowerText] = useState('Lower Text');
    const [icon] = useState('markers/icons/cart.png'); // For now only cart.png
    const [generatedTexture, setGeneratedTexture] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Allow Enter key to generate texture
            if (event.key === 'Enter' && !isGenerating) {
                handleGenerateTexture();
            }
            // Allow Escape to clear texture
            if (event.key === 'Escape') {
                setGeneratedTexture(null);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [isGenerating]);

    const handleGenerateTexture = async () => {
        setIsGenerating(true);
        try {
            const textureData: CanvasRenderingContext2D | null = await TextureService.createMarkerTexture(icon, upperText, lowerText);
            if (textureData) {
                const dataURL = textureData.canvas.toDataURL();
                setGeneratedTexture(dataURL);
            } else {
                setGeneratedTexture(null);
            }
        } catch (error) {
            console.error('Failed to generate texture:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <h2 className={styles.title}>Texture Debug Interface</h2>
                
                <div className={styles.controls}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Upper Text:</label>
                        <input
                            type="text"
                            value={upperText}
                            onChange={(e) => setUpperText(e.target.value)}
                            className={styles.input}
                            placeholder="Enter upper text..."
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Lower Text:</label>
                        <input
                            type="text"
                            value={lowerText}
                            onChange={(e) => setLowerText(e.target.value)}
                            className={styles.input}
                            placeholder="Enter lower text..."
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Icon:</label>
                        <div className={styles.iconSelector}>
                            <span className={styles.iconPath}>{icon}</span>
                            <div className={styles.iconPreview}>
                                <img src={icon} alt="Icon preview" className={styles.iconImage} />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerateTexture}
                        disabled={isGenerating}
                        className={styles.generateButton}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Texture'}
                    </button>
                </div>

                {generatedTexture && (
                    <div className={styles.preview}>
                        <h3 className={styles.previewTitle}>Generated Texture:</h3>
                        <div className={styles.textureContainer}>
                            <img 
                                src={generatedTexture} 
                                alt="Generated texture" 
                                className={styles.textureImage}
                            />
                        </div>
                    </div>
                )}

                <div className={styles.info}>
                    <h3 className={styles.infoTitle}>Debug Info:</h3>
                    <div className={styles.infoContent}>
                        <p><strong>Upper Text:</strong> {upperText}</p>
                        <p><strong>Lower Text:</strong> {lowerText}</p>
                        <p><strong>Icon:</strong> {icon}</p>
                        <p><strong>Status:</strong> {isGenerating ? 'Generating...' : 'Ready'}</p>
                    </div>
                    <div className={styles.shortcuts}>
                        <p><strong>Shortcuts:</strong></p>
                        <p>• Enter: Generate Texture</p>
                        <p>• Escape: Clear Preview</p>
                    </div>
                </div>
            </div>
        </div>
    );
}