import { encodeData } from '@shared/DataEncoder';
import { generateHash } from '@shared/Hash';

export default class EventService {
	public static triggerEvent(eventName: string, ...args: any[]) {
		const encodedData = encodeData(args);
		const hash = generateHash(eventName);
		mp.events.callRemote('event:trigger', hash, eventName, encodedData);
	}
}
