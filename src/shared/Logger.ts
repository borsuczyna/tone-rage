export default class Logger {
    private static loggers: { [key: string]: Logger } = {};
    private parentName: string;

    public static getLogger<T>(constructor: new (...args: any[]) => T): Logger {
        const className = constructor.name;
        if (!this.loggers[className]) {
            this.loggers[className] = new Logger(className);
        }

        return this.loggers[className];
    }

    constructor(parentName: string) {
        this.parentName = parentName;
    }
    
    public info(...args: any[]) {
        console.log(`\x1b[32m[INFO]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m`, ...args);
    }

    public error(...args: any[]) {
        console.error(`\x1b[31m[ERROR]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m`, ...args);
    }

    public debug(...args: any[]) {
        console.debug(`\x1b[35m[DEBUG]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m`, ...args);
    }

    public warn(...args: any[]) {
        console.warn(`\x1b[33m[WARN]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m`, ...args);
    }
}