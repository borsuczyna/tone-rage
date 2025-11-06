import { ShareMode } from '@shared/Models/ElementDataModels';

export const ElementDataKeys = {
	ServerSync: ['clientScore'],
	ClientSync: ['customData']
};

export function canSyncElementDataKey(key: string, shareMode: ShareMode): boolean {
	if (shareMode === ShareMode.Server) {
		return ElementDataKeys.ServerSync.includes(key);
	} else if (shareMode === ShareMode.Everywhere) {
		return ElementDataKeys.ClientSync.includes(key);
	}

	return false;
}
