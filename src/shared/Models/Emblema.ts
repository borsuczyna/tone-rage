export type Emblema = 
    'premium' |
    'admin-moderator' |
    'admin-administrator';

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
};