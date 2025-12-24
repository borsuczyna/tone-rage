import styles from '../../Styles/ChatInterface.module.css';
import Button from '../Button';
export default function ChatSettings({ open, settings, onSettingsChange, onClose }) {
    if (!open)
        return null;
    const updateSettings = (newSettings) => {
        const updatedSettings = { ...settings, ...newSettings };
        onSettingsChange(updatedSettings);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    return (<div className={styles.settingsModal} onClick={onClose}>
            <div className={styles.settingsContent} onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown} tabIndex={0}>
                <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>Chat Settings</h3>
                    <p className={styles.settingsSubtitle}>Customize your chat experience</p>
                </div>
                
                <div className={styles.settingsBody}>
                    <div className={styles.settingGroup}>
                        <label className={styles.settingLabel}>Chat Width</label>
                        <input type="range" min="30" max="80" step="1" value={settings.width} onChange={(e) => updateSettings({ width: Number(e.target.value) })} className={styles.settingSlider}/>
                    </div>
                    
                    <div className={styles.settingGroup}>
                        <label className={styles.settingLabel}>Chat Height</label>
                        <input type="range" min="10" max="40" step="1" value={settings.height} onChange={(e) => updateSettings({ height: Number(e.target.value) })} className={styles.settingSlider}/>
                    </div>
                    
                    <div className={styles.settingGroup}>
                        <label className={styles.settingLabel}>Content Zoom</label>
                        <input type="range" min="0.5" max="2" step="0.1" value={settings.zoom} onChange={(e) => updateSettings({ zoom: Number(e.target.value) })} className={styles.settingSlider}/>
                    </div>
                </div>
                
                <div className={styles.settingsFooter}>
                    <Button variant="primary" size="medium" onClick={onClose} style={{ width: '100%' }}>
                        Done
                    </Button>
                </div>
            </div>
        </div>);
}
