import { createContext, useContext, useState, useCallback } from 'react';
import { useRageEvent } from './RageEventProvider';
import SharedConfig from '@shared/SharedConfig';
const UserInfoContext = createContext(undefined);
export function UserInfoProvider({ children }) {
    const [userInfo, setUserInfo] = useState({
        health: 0,
        exp: 0,
        money: 0,
        avatar: SharedConfig.DefaultAvatar,
        username: "",
        level: 0,
    });
    const [workInfo, setWorkInfo] = useState({
        currentJob: null,
        workTimeElapsed: 0,
        moneyEarned: 0,
        hourlyEarnings: 0,
    });
    // Listen for user info updates from RageMP
    useRageEvent('updateUserInfo', useCallback((data) => {
        if (data.userInfo) {
            data.userInfo.avatar = data.userInfo.avatar || SharedConfig.DefaultAvatar;
            setUserInfo(prev => ({ ...prev, ...data.userInfo }));
        }
        if (data.workInfo) {
            setWorkInfo(prev => ({ ...prev, ...data.workInfo }));
        }
    }, []));
    const value = {
        userInfo,
        workInfo,
    };
    return (<UserInfoContext.Provider value={value}>
            {children}
        </UserInfoContext.Provider>);
}
export function useUserInfo() {
    const context = useContext(UserInfoContext);
    if (context === undefined) {
        throw new Error('useUserInfo must be used within a UserInfoProvider');
    }
    return context;
}
