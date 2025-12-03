export type Emblema = 
    'premium' |
    'admin-moderator' |
    'admin-administrator' |
    'dm-forward' |
    'dm-reply';

export const emblemasData: { [key in Emblema]: { icon: string; color: string } } = {
    'premium': {
        icon: 'Star',
        color: '#FFD700', // Gold
    },
    'admin-moderator': {
        icon: 'Shield',
        color: '#1E90FF', // Dodger Blue
    },
    'admin-administrator': {
        icon: 'Shield',
        color: '#FF4500', // Orange Red
    },
    'dm-forward': {
        icon: 'Forward',
        color: '#00C851', // Orange
    },
    'dm-reply': {
        icon: 'Reply',
        color: '#e38800', // Orange
    }
};