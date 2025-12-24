import { writable } from 'svelte/store';
import SharedConfig from '@shared/SharedConfig';
export const userInfo = writable({
    health: 0,
    exp: 0,
    money: 0,
    avatar: SharedConfig.DefaultAvatar,
    username: "",
    level: 0,
});
export const workInfo = writable({
    currentJob: null,
    workTimeElapsed: 0,
    moneyEarned: 0,
    hourlyEarnings: 0,
});
export function updateUserInfo(data) {
    if (data.userInfo) {
        data.userInfo.avatar = data.userInfo.avatar || SharedConfig.DefaultAvatar;
        userInfo.update(prev => ({ ...prev, ...data.userInfo }));
    }
    if (data.workInfo) {
        workInfo.update(prev => ({ ...prev, ...data.workInfo }));
    }
}
