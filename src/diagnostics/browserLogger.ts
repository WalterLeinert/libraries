import { Platform } from '../base/platform';
import { Dictionary } from '../types/dictionary';
import { Types } from '../types/types';

import { levels } from './level';
import { ILevel, } from './level.interface';
import { ILogger } from './logger.interface';


export class BrowserLogger implements ILogger {
    private static loggerDict: Dictionary<string, ILogger> = new Dictionary<string, ILogger>();

    private level: ILevel = levels.INFO;

    public static configure(filename: string, options?: any): void {
        // TODO
    }

    public static getLoggerCount(): number {
        return BrowserLogger.loggerDict.count;
    }

    public static hasLogger(categoryName: string): boolean {
        return BrowserLogger.loggerDict.containsKey(categoryName);
    }

    private constructor(private categoryName: string) {
    }

    /**
     * erzeugt eine neue Logger-Instanz
     */
    public static create(categoryName: string) {
        const logger = new BrowserLogger(categoryName);
        BrowserLogger.loggerDict.set(categoryName, logger);
        return logger;
    }

    public trace(message: string, ...args: any[]): void {
        console.trace(message, ...args);
    }

    public debug(message: string, ...args: any[]): void {
        console.debug(message, ...args);
    }

    public info(message: string, ...args: any[]): void {
        console.info(message, ...args);
    }

    public warn(message: string, ...args: any[]): void {
        console.warn(message, ...args);
    }

    public error(message: string, ...args: any[]): void {
        console.error(message, ...args);
    }

    public fatal(message: string, ...args: any[]): void {
        console.error(message, ...args);
    }

    public isLevelEnabled(level: ILevel): boolean {
        return this.level.isLessThanOrEqualTo(level);
    }

    public isTraceEnabled(): boolean {
        return this.level.isLessThanOrEqualTo(levels.TRACE);
    }

    public isDebugEnabled(): boolean {
        return this.level.isLessThanOrEqualTo(levels.DEBUG);
    }

    public isInfoEnabled(): boolean {
        return this.level.isLessThanOrEqualTo(levels.INFO);
    }

    public isWarnEnabled(): boolean {
        return this.level.isLessThanOrEqualTo(levels.WARN);
    }

    public isErrorEnabled(): boolean {
        return this.level.isLessThanOrEqualTo(levels.ERROR);
    }

    public isFatalEnabled(): boolean {
        return this.level.isLessThanOrEqualTo(levels.FATAL);
    }


    public setLevel(level: string | ILevel) {
        let lev: ILevel;

        if (!Types.isString(level)) {
            lev = level as ILevel;
        } else {
            throw new Error(`Level string ${level} currently not supported`);
        }
        this.level = lev;
    }

}