export class Timer {
	private timer: NodeJS.Timer;
	private callback: () => void;
	public delay: number;
	public callTimes: number;
	public callsMade: number;

	constructor(callback: () => void, delay: number, callTimes: number) {
		this.callback = callback;
		this.delay = delay;
		this.callTimes = callTimes;
		this.callsMade = 0;
		this.timer = null!;
		this.start();
	}

	private start() {
		this.timer = setInterval(() => this.call(), this.delay);
	}

	public stop() {
		clearInterval(this.timer);
		TimerService.killTimer(this);
	}

    public kill() {
		clearInterval(this.timer);
    }

	private call() {
		this.callback();
		this.callsMade++;

		if (this.callTimes > 0 && this.callsMade >= this.callTimes) {
			this.stop();
		}
	}
}

export default class TimerService {
	private static timers: Timer[] = [];

	public static setTimer(callback: () => void, delay: number, callTimes: number = 1) {
		const timer = new Timer(callback, delay, callTimes);
		this.timers.push(timer);
		return timer;
	}

	public static killTimer(timer: Timer) {
		const index = this.timers.indexOf(timer);
		if (index > -1) {
			this.timers.splice(index, 1);
		}

        timer.kill();
	}
}
