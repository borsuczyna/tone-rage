declare const mp: any;

export default class Logger {
	private static loggers: { [key: string]: Logger } = {};
	private parentName: string;
	private logToFile: boolean = false;
	private static fileHandle: any = null;
	private static fileHandleName: string = '';
    private static isClientSide: boolean = (typeof mp !== 'undefined' && mp && mp.console);

	public static getLogger<T>(constructor: new (...args: any[]) => T, logToFile: boolean = false): Logger {
		const className = constructor.name;
		if (!this.loggers[className]) {
			this.loggers[className] = new Logger(className, logToFile);
		}

		return this.loggers[className];
	}

	constructor(parentName: string, logToFile: boolean = false) {
		this.parentName = parentName;
		this.logToFile = logToFile;
	}

	public info(...args: any[]) {
        if (!Logger.isClientSide) {
            this.log(`\x1b[32m[INFO]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m`, ...args);
        } else {
            mp.console.logInfo(`[INFO] [${this.parentName}] ${args.join(' ')}`);
        }
	}

	public error(...args: any[]) {
        if (!Logger.isClientSide) {
            this.log(`\x1b[31m[ERROR]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m`, ...args);
        } else {
            mp.console.logError(`[ERROR] [${this.parentName}] ${args.join(' ')}`);
        }
	}

	public debug(...args: any[]) {
        if (!Logger.isClientSide) {
            this.log(`\x1b[35m[DEBUG]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m`, ...args);
        } else {
            mp.console.logInfo(`[DEBUG] [${this.parentName}] ${args.join(' ')}`);
        }
	}

	public warn(...args: any[]) {
        if (!Logger.isClientSide) {
            this.log(`\x1b[33m[WARN]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m`, ...args);
        } else {
            mp.console.logWarning(`[WARN] [${this.parentName}] ${args.join(' ')}`);
        }
	}

	private getFileHandle() {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const logFileName = `${year}-${month}-${day}.log`;

		if (Logger.fileHandleName !== logFileName) {
			if (Logger.fileHandle) {
				Logger.fileHandle.end();
			}
			Logger.fileHandleName = logFileName;
		}

		if (!Logger.fileHandle) {
			const fs = require('fs');
			const path = require('path');
			const logDir = path.resolve(__dirname, '../../logs');
			fs.mkdirSync(logDir, { recursive: true });
			Logger.fileHandle = fs.createWriteStream(path.join(logDir, logFileName), { flags: 'a' });
		}

		return Logger.fileHandle;
	}

	private log(...args: any[]) {
        if (mp && mp.console && mp.console.logInfo) {
            mp.console.logInfo(args.join(' '));
        } else {
            console.log(...args);
        }

		if (this.logToFile) {
			const fileHandle = this.getFileHandle();
			const cleanArgs = args.map((arg) => (typeof arg === 'string' ? arg.replace(/\x1b\[[0-9;]*m/g, '') : arg));
			fileHandle.write(`${new Date().toISOString()} - ${cleanArgs.join(' ')}\n`);
		}
	}
}
