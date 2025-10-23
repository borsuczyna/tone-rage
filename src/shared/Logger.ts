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
    public info(message: string) {
        console.log(`\x1b[32m[INFO]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m ${message}`);
    }

    public error(message: string) {
        console.error(`\x1b[31m[ERROR]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m ${message}`);
    }

    public debug(message: string) {
        console.debug(`\x1b[35m[DEBUG]\x1b[0m \x1b[36m[${this.parentName}]\x1b[0m ${message}`);
    }
}