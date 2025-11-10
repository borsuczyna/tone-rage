import { useUserInfo } from 'src/Hooks/UserInfoProvider';
import styles from './Styles/HudInterface.module.css';
import translate from '@shared/Translation/Translation';

export default function HudInterface() {
    const { userInfo, workInfo } = useUserInfo();
    const { health, exp, money, avatar, username, level } = userInfo;
    const { currentJob, workTimeElapsed, moneyEarned, hourlyEarnings } = workInfo;

    // Calculate health bar offset (100% health = 0 offset, 0% health = full circumference)
    const healthCircumference = 471;
    const healthOffset = healthCircumference - (healthCircumference * health * 0.38) / 100;
    const expOffset = healthCircumference - (healthCircumference * exp * -0.38) / 100;

    if (!username) return null;

    return (
        <div className={styles.main}>
            <div className={styles.playerInfo}>
                <div className={styles.playerDetails}>
                    <span className={styles.username}>{username}</span>
                    <span className={styles.money}>${money}</span>
                </div>
                <div className={styles.avatarContainer}>
                    <svg className={styles.backgroundRing} viewBox="0 0 200 200">
                        <defs>
                            <linearGradient id="expGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#00ffff" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                        </defs>
                        <circle
                            className={styles.backgroundBar}
                            cx="100"
                            cy="100"
                            r="75"
                        />
                        <circle
                            className={styles.healthBar}
                            cx="100"
                            cy="100"
                            r="75"
                            style={{ strokeDashoffset: healthOffset }}
                        />
                        <circle
                            className={styles.expBarGlow}
                            cx="100"
                            cy="100"
                            r="75"
                            style={{ strokeDashoffset: expOffset }}
                        />
                        <circle
                            className={styles.expBar}
                            cx="100"
                            cy="100"
                            r="75"
                            style={{ strokeDashoffset: expOffset }}
                        />
                    </svg>
                    <img
                        src={avatar}
                        className={styles.avatar}
                    />
                    <div className={styles.levelBadge}>
                        <span>{level}</span>
                    </div>
                </div>
            </div>
            {currentJob && (
                <div className={styles.jobInfo}>
                    <div className={styles.jobTitle}>{currentJob} {translate('hud.job.work')}</div>
                    <div className={styles.jobStats}>
                        <div className={styles.jobStat}>
                            <span className={styles.jobLabel}>{translate('hud.job.workingTime')}</span>
                            <span className={styles.jobValue}>{workTimeElapsed}</span>
                        </div>
                        <div className={styles.jobStat}>
                            <span className={styles.jobLabel}>{translate('hud.job.earnedMoney')}</span>
                            <span className={styles.jobValue}>${moneyEarned}</span>
                        </div>
                        <div className={styles.jobStat}>
                            <span className={styles.jobLabel}>{translate('hud.job.averageEarnings')}</span>
                            <span className={styles.jobValue}>${hourlyEarnings}/h</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
