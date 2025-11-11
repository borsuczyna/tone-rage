import { useState } from 'react';
import styles from './Styles/ScoreboardInterface.module.css';
import * as Icons from 'lucide-react';
import type { ScoreboardPlayerItem } from '@shared/Models/ScoreboardData';
import { AdminLevel } from '@shared/Models/AdminLevel';
import { getStatusColor, getStatusText } from '@shared/Models/PlayerStatus';
import SharedConfig from '@shared/SharedConfig';
import Logo from './Components/Logo';
import EmblemaElement from './Components/EmblemaElement';
import InputField from './Components/InputField';
import translate from '@shared/Translation/Translation';

const playerCategories = [
    {
        name: translate('scoreboard.categories.all'),
        icon: 'Users',
        filter: (player: ScoreboardPlayerItem) => true
    },
    {
        name: translate('scoreboard.categories.admins'),
        icon: 'Shield',
        filter: (player: ScoreboardPlayerItem) => {
            return player.adminLevel > AdminLevel.User;
        }
    }
];

// const placeholderPlayers: ScoreboardPlayerItem[] = [
//     { id: 1, username: 'TheNoobisty', level: 921, ping: 12, status: 'playing', adminLevel: AdminLevel.User },
//     { id: 2, username: 'revenom', level: 24, ping: 62, status: 'afk', adminLevel: AdminLevel.User },
//     { id: 3, username: 'xorian', level: 200, ping: 11, adminLevel: AdminLevel.Admin, status: 'playing' },
//     { id: 4, username: 'IQ', level: 12, ping: 51, status: 'playing', adminLevel: AdminLevel.User },
//     { id: 5, username: 'borsuczyna', level: 0, ping: 51, status: 'playing', adminLevel: AdminLevel.Admin, emblemas: ['admin-administrator', 'admin-moderator', 'premium'] },
//     { id: 1, username: 'TheNoobisty', level: 921, ping: 12, status: 'playing', adminLevel: AdminLevel.User },
//     { id: 2, username: 'revenom', level: 24, ping: 62, status: 'afk', adminLevel: AdminLevel.User },
//     { id: 3, username: 'xorian', level: 200, ping: 11, adminLevel: AdminLevel.Admin, status: 'playing' },
//     { id: 4, username: 'IQ', level: 12, ping: 51, status: 'playing', adminLevel: AdminLevel.User },
//     { id: 5, username: 'borsuczyna', level: 0, ping: 51, status: 'playing', adminLevel: AdminLevel.Admin, emblemas: ['admin-administrator', 'admin-moderator', 'premium'] },
//     { id: 1, username: 'TheNoobisty', level: 921, ping: 12, status: 'playing', adminLevel: AdminLevel.User },
//     { id: 2, username: 'revenom', level: 24, ping: 62, status: 'afk', adminLevel: AdminLevel.User },
//     { id: 3, username: 'xorian', level: 200, ping: 11, adminLevel: AdminLevel.Admin, status: 'playing' },
//     { id: 4, username: 'IQ', level: 12, ping: 51, status: 'playing', adminLevel: AdminLevel.User },
//     { id: 5, username: 'borsuczyna', level: 0, ping: 51, status: 'playing', adminLevel: AdminLevel.Admin, emblemas: ['admin-administrator', 'admin-moderator', 'premium'] },
//     { id: 1, username: 'TheNoobisty', level: 921, ping: 12, status: 'playing', adminLevel: AdminLevel.User },
//     { id: 2, username: 'revenom', level: 24, ping: 62, status: 'afk', adminLevel: AdminLevel.User },
//     { id: 3, username: 'xorian', level: 200, ping: 11, adminLevel: AdminLevel.Admin, status: 'playing' },
//     { id: 4, username: 'IQ', level: 12, ping: 51, status: 'playing', adminLevel: AdminLevel.User },
//     { id: 5, username: 'borsuczyna', level: 0, ping: 51, status: 'playing', adminLevel: AdminLevel.Admin, emblemas: ['admin-administrator', 'admin-moderator', 'premium'] },
//     { id: 1, username: 'TheNoobisty', level: 921, ping: 12, status: 'playing', adminLevel: AdminLevel.User },
//     { id: 2, username: 'revenom', level: 24, ping: 62, status: 'afk', adminLevel: AdminLevel.User },
//     { id: 3, username: 'xorian', level: 200, ping: 11, adminLevel: AdminLevel.Admin, status: 'playing' },
//     { id: 4, username: 'IQ', level: 12, ping: 51, status: 'playing', adminLevel: AdminLevel.User },
//     { id: 5, username: 'borsuczyna', level: 0, ping: 51, status: 'playing', adminLevel: AdminLevel.Admin, emblemas: ['admin-administrator', 'admin-moderator', 'premium'] },
// ];

const placeholderServerInfo = {
    name: 'directMTA',
    playerCount: 142,
    maxPlayers: 200
};

export default function ScoreboardInterface() {
    const [players, setPlayers] = useState<ScoreboardPlayerItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

    const filteredPlayers = players.filter(player =>
        (
            player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.id.toString().includes(searchTerm)
        ) &&
        playerCategories[selectedCategoryIndex].filter(player)
    );

    const IconComponent = (Icons as any)[playerCategories[selectedCategoryIndex].icon];

    const nextCategory = () => {
        setSelectedCategoryIndex((selectedCategoryIndex + 1) % playerCategories.length);
    };

    return (
        <div className={styles.container}>
            <div className={styles.scoreboard}>
                <div className={styles.header}>
                    <div className={styles.logoContainer}>
                        <Logo glow={4} className={styles.logo} />
                    </div>
                    
                    <InputField
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e)}
                        placeholder={translate('scoreboard.search')}
                        rightElement={(
                            <div className={styles.categorySelector} onClick={nextCategory}>
                                <span>{playerCategories[selectedCategoryIndex].name}</span>
                                <IconComponent size='0.9rem' fill='#fff' />
                            </div>
                        )}
                    />

                    <div className={styles.serverStats}>
                        <span className={styles.playerCount}>{placeholderServerInfo.playerCount}</span>
                        <div className={styles.onlineIndicator} />
                    </div>
                </div>

                <div className={styles.playersList}>
                    {filteredPlayers.length > 0 ? <>
                        {filteredPlayers.map((player, index) => (
                            <div key={index} className={styles.playerCard}>
                                <div className={styles.playerRank}>
                                    {player.id}
                                </div>
                                
                                <div className={styles.playerAvatarContainer}>
                                    <img src={player.avatar ?? SharedConfig.DefaultAvatar} className={styles.avatar} />
                                </div>
                                
                                <div className={styles.playerInfo}>
                                    <div className={styles.playerName}>
                                        {player.username}

                                        <div className={styles.emblemasContainer}>
                                            {player.emblemas?.map((emblema) => (
                                                <EmblemaElement key={emblema} emblema={emblema} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.playerStatus}>
                                        <div className={styles.dot} style={{ backgroundColor: getStatusColor(player.adminLevel, player.status) }} />
                                        <span>{getStatusText(player.adminLevel, player.status)}</span>
                                    </div>
                                </div>
                                
                                <div className={styles.playerLevel}>
                                    <div className={styles.levelNumber}>{player.level}</div>
                                    <div className={styles.levelLabel}>LEVEL</div>
                                </div>
                                
                                <div className={styles.playerPing}>
                                    <Icons.Wifi size='1rem' className={styles.pingIcon} />
                                    <span>{player.ping} ms</span>
                                </div>
                            </div>
                        ))}
                    </> : (
                        <div className={styles.noPlayersFound}>
                            {translate('scoreboard.noPlayersFound')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}