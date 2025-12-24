import { reactive, readonly } from 'vue';
import { useRageEvent } from './RageEventProvider';
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

interface UserInfoState {
    userInfo: UserInfo;
    workInfo: WorkInfo;
}

const state = reactive<UserInfoState>({
    userInfo: {
        health: 0,
        exp: 0,
        money: 0,
        avatar: SharedConfig.DefaultAvatar,
        username: "",
        level: 0,
    },
    workInfo: {
        currentJob: null,
        workTimeElapsed: 0,
        moneyEarned: 0,
        hourlyEarnings: 0,
    }
});

// Initialize event listener
export function initUserInfoProvider() {
    useRageEvent('updateUserInfo', (data: UserInfoUpdate) => {
        if (data.userInfo) {
            data.userInfo.avatar = data.userInfo.avatar || SharedConfig.DefaultAvatar;
            Object.assign(state.userInfo, data.userInfo);
        }
        if (data.workInfo) {
            Object.assign(state.workInfo, data.workInfo);
        }
    });
}

export function useUserInfo() {
    return {
        userInfo: readonly(state.userInfo),
        workInfo: readonly(state.workInfo)
    };
}
