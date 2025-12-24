import { writable } from 'svelte/store';
import SharedConfig from '@shared/SharedConfig';

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

export const userInfo = writable<UserInfo>({
    health: 0,
    exp: 0,
    money: 0,
    avatar: SharedConfig.DefaultAvatar,
    username: "",
    level: 0,
});

export const workInfo = writable<WorkInfo>({
    currentJob: null,
    workTimeElapsed: 0,
    moneyEarned: 0,
    hourlyEarnings: 0,
});

export function updateUserInfo(data: UserInfoUpdate) {
    if (data.userInfo) {
        data.userInfo.avatar = data.userInfo.avatar || SharedConfig.DefaultAvatar;
        userInfo.update(prev => ({ ...prev, ...data.userInfo }));
    }
    if (data.workInfo) {
        workInfo.update(prev => ({ ...prev, ...data.workInfo }));
    }
}
