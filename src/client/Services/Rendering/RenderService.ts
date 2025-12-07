export default class RenderService {
	private static lastTick: number | null = null;
	public static deltaTime: number = 10;

	public static async init() {
		mp.events.add('render', this.handleRender.bind(this));
	}

	private static handleRender() {
		const currentTick = mp.game.gameplay.getGameTimer();
		this.deltaTime = currentTick - (this.lastTick || currentTick);
		this.lastTick = currentTick;
	}
}
