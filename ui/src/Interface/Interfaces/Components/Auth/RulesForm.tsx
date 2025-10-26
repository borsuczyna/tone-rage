import * as Icons from "lucide-react";
import Button from '../Button';
import styles from '../../Styles/AuthInterface.module.css';

interface RulesFormProps {
    onBackToLogin: () => void;
    onAcceptAndRegister: () => void;
}

export default function RulesForm({ onBackToLogin, onAcceptAndRegister }: RulesFormProps) {
    return (
        <div className={styles.rulesContainer}>
            <div className={styles.header}>
                <h1>Server Rules</h1>
                <p>Please read and understand our community guidelines</p>
            </div>
            
            <div className={styles.rulesContent}>
                <div className={styles.ruleSection}>
                    <h3><Icons.Shield size={20} /> General Rules</h3>
                    <ul>
                        <li>Respect all players and staff members</li>
                        <li>No harassment, discrimination, or toxic behavior</li>
                        <li>Use appropriate language in all communications</li>
                        <li>Follow roleplay scenarios realistically</li>
                    </ul>
                </div>
                
                <div className={styles.ruleSection}>
                    <h3><Icons.Car size={20} /> Racing Rules</h3>
                    <ul>
                        <li>No ramming or intentional collisions</li>
                        <li>Maintain fair racing practices</li>
                        <li>No exploiting game mechanics</li>
                        <li>Respect track limits and racing lines</li>
                    </ul>
                </div>
                
                <div className={styles.ruleSection}>
                    <h3><Icons.Ban size={20} /> Prohibited Actions</h3>
                    <ul>
                        <li>Cheating, hacking, or using unauthorized modifications</li>
                        <li>Exploiting bugs or glitches</li>
                        <li>Sharing account information</li>
                        <li>Advertising other servers or external content</li>
                    </ul>
                </div>
                
                <div className={styles.ruleSection}>
                    <h3><Icons.Gavel size={20} /> Consequences</h3>
                    <ul>
                        <li>Warnings for minor infractions</li>
                        <li>Temporary bans for serious violations</li>
                        <li>Permanent bans for severe or repeated offenses</li>
                        <li>Appeals can be submitted through official channels</li>
                    </ul>
                </div>
            </div>
            
            <div className={styles.rulesActions}>
                <Button variant="glass" size="medium" onClick={onBackToLogin} style={{flex: 1, width: '100%'}}>
                    <Icons.ArrowLeft size={'1rem'} />
                    Back to Login
                </Button>
                <Button variant="primary" size="medium" onClick={onAcceptAndRegister} style={{flex: 1, width: '100%'}}>
                    <Icons.Check size={'1rem'} />
                    Accept & Register
                </Button>
            </div>
        </div>
    );
}