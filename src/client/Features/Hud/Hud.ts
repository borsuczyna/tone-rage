import ElementDataService from '@/Services/Infrastructure/ElementDataService';
import EventService from '@/Services/Infrastructure/EventService';
import InterfaceService from '@/Services/Infrastructure/InterfaceService';
import TimerService, { Timer } from '@shared/Services/TimerService';

export default class Hud {
	private static updateTimer: Timer | null = null;
    private static minimapScaleform: number;

	public static async init() {
        this.minimapScaleform = mp.game.graphics.requestScaleformMovie('MINIMAP');

		this.setVisible(false);
		EventService.registerEventHandler('money:update', this.update.bind(this));
        mp.events.add('render', this.onRender.bind(this));
	}

	public static setVisible(visible: boolean) {
		InterfaceService.setInterfaceVisible('HudInterface', visible);
		mp.game.ui.displayHud(false);
		mp.game.ui.displayRadar(visible);

		if (visible) {
			this.updateTimer = TimerService.setTimer(this.update.bind(this), 1000, 0);
			this.update();
		} else if (this.updateTimer) {
			TimerService.killTimer(this.updateTimer);
			this.updateTimer = null;
		}
	}

	private static update() {
		const username = mp.players.local.name;
		const health = mp.players.local.getHealth();
		const money = ElementDataService.get(mp.players.local, 'money') || 0;
		const level = ElementDataService.get(mp.players.local, 'level') || 0;
		const exp = ElementDataService.get(mp.players.local, 'exp') || 0;
		const avatar = ElementDataService.get(mp.players.local, 'avatar') || '';

		InterfaceService.callInterfaceEvent('updateUserInfo', {
			userInfo: {
				username,
				health,
				money,
				level,
				exp,
				avatar
			}
		});
	}

    // hide default health and armor bars
    private static onRender() {
        mp.game.graphics.pushScaleformMovieFunction(this.minimapScaleform, "SETUP_HEALTH_ARMOUR");
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(3);
        mp.game.graphics.popScaleformMovieFunctionVoid();
    }
}
