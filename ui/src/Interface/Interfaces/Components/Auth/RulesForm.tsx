import * as Icons from "lucide-react";
import translate from '@shared/Translation/Translation';
import Button from '../Button';
import styles from '../../Styles/AuthInterface.module.css';
import rulesData from '@shared/RulesData';

interface RulesFormProps {
    onBackToLogin: () => void;
    onAcceptAndRegister: () => void;
}

export default function RulesForm({ onBackToLogin, onAcceptAndRegister }: RulesFormProps) {
    return (
        <div className={styles.rulesContainer}>
            <div className={styles.header}>
                <h1>{translate('auth.rules.title')}</h1>
                <p>{translate('auth.rules.subtitle')}</p>
            </div>
            
            <div className={styles.rulesContent}>
                {rulesData.map((section, index) => {
                    const IconJSX = (Icons as any)[section.icon.charAt(0).toUpperCase() + section.icon.slice(1).replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())] || Icons['Bell'];
                    
                    return (
                        <div key={index} className={styles.ruleSection}>
                            <h3><IconJSX /> {section.title}</h3>
                            <ul>
                                {section.rules.map((rule, ruleIndex) => (
                                    <li key={ruleIndex}>{rule}</li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
            
            <div className={styles.rulesActions}>
                <Button variant="glass" size="medium" onClick={onBackToLogin} style={{flex: 1, width: '100%'}}>
                    <Icons.ArrowLeft size={'1rem'} />
                    {translate('auth.rules.backToLogin')}
                </Button>
                <Button variant="primary" size="medium" onClick={onAcceptAndRegister} style={{flex: 1, width: '100%'}}>
                    <Icons.Check size={'1rem'} />
                    {translate('auth.rules.acceptAndRegister')}
                </Button>
            </div>
        </div>
    );
}