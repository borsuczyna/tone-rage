import { useState } from 'react';
import styles from './CircleInterface.module.css'

export default function CircleInterface(): React.ReactNode {
    const [angle, setAngle] = useState(45);

    return (
        <div className={styles.main}>
            <div style={{
                background: `conic-gradient(blue ${angle}deg, transparent ${angle}deg)`,
                borderRadius: '50%',
                width: '100px',
                height: '100px',
                marginBottom: '20px'
            }} />

            <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
            />
        </div>
    )
}