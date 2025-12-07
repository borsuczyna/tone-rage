import { AdminLevel, getAdminEmblem } from '@shared/Models/AdminLevel';
import { Emblema } from '@shared/Models/Emblema';

export default class EmblemaService {
	public static getPlayerEmblems(_player: PlayerMp, adminLevel: AdminLevel): Emblema[] {
		const emblemas: Emblema[] = [];

		const adminEmblem = getAdminEmblem(adminLevel);
		if (adminEmblem) {
			emblemas.push(adminEmblem);
		}

		return emblemas;
	}
}
