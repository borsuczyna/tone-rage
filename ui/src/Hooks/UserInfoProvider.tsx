import { createContext, useContext, useState } from 'react';
import { useRageEvent } from './RageEventProvider';
import type { ReactNode } from 'react';

interface UserInfo {
    health: number;
    exp: number;
    money: number;
    avatar: string;
    username: string;
    level: number;
}

interface WorkInfo {
    currentJob: string | null;
    workTimeElapsed: number;
    moneyEarned: number;
    hourlyEarnings: number;
}

interface UserInfoUpdate {
    userInfo?: Partial<UserInfo>;
    workInfo?: Partial<WorkInfo>;
}

interface UserInfoContextType {
    userInfo: UserInfo;
    workInfo: WorkInfo;
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export function UserInfoProvider({ children }: { children: ReactNode }) {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        health: 0,
        exp: 0,
        money: 0,
        avatar: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        username: "",
        level: 0,
    });

    const [workInfo, setWorkInfo] = useState<WorkInfo>({
        currentJob: null,
        workTimeElapsed: 0,
        moneyEarned: 0,
        hourlyEarnings: 0,
    });

    // Listen for user info updates from RageMP
    useRageEvent('updateUserInfo', (data: UserInfoUpdate) => {
        if (data.userInfo) {
            setUserInfo(prev => ({ ...prev, ...data.userInfo }));
        }
        if (data.workInfo) {
            setWorkInfo(prev => ({ ...prev, ...data.workInfo }));
        }
    });

    const value: UserInfoContextType = {
        userInfo,
        workInfo,
    };

    return (
        <UserInfoContext.Provider value={value}>
            {children}
        </UserInfoContext.Provider>
    );
}

export function useUserInfo(): UserInfoContextType {
    const context = useContext(UserInfoContext);
    if (context === undefined) {
        throw new Error('useUserInfo must be used within a UserInfoProvider');
    }
    return context;
}