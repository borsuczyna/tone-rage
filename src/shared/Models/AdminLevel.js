import translate from '../Translation/Translation';
export const AdminLevel = {
    User: 0,
    Moderator: 1,
    Admin: 2
};
export const adminLevels = {
    [AdminLevel.User]: translate('admin.level.user'),
    [AdminLevel.Moderator]: translate('admin.level.moderator'),
    [AdminLevel.Admin]: translate('admin.level.admin')
};
export const adminLevelColors = {
    [AdminLevel.User]: '#6b7280', // Gray
    [AdminLevel.Moderator]: '#1E90FF', // Dodger Blue
    [AdminLevel.Admin]: '#FF4500' // Orange Red
};
export function getAdminEmblem(adminLevel) {
    switch (adminLevel) {
        case AdminLevel.Moderator:
            return 'admin-moderator';
        case AdminLevel.Admin:
            return 'admin-administrator';
        default:
            return null;
    }
}
