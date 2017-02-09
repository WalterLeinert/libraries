import { ILevel, ILogger, Level } from '.';
import { Platform } from '../base';
import { Types } from '../types';
import { BrowserLogger } from './browserLogger';



export function getLogger(categoryName: string): ILogger {
    if (Platform.isNode()) {
        let log4js = require('log4js');
        return new Logger(log4js.getLogger(categoryName));
    } else {
        return new Logger(BrowserLogger.create(categoryName));
    }

}

export function configure(filename: string, options?: any): void {
    if (Platform.isNode()) {
        const log4js = require('log4js');
        log4js.configure(filename, options);
    } else {
        BrowserLogger.configure(filename, options);
    }
}


/**
 * Proxy für log4js bzw. @see{BrowserLogger}.
 */
export class Logger implements ILogger {

    public constructor(private logger: ILogger) {
    }


    public trace(message: string, ...args: any[]): void {
        this.logger.trace(message, ...args);
    }


    public debug(message: string, ...args: any[]): void {
        this.logger.debug(message, ...args);
    }

    public info(message: string, ...args: any[]): void {
        this.logger.info(message, ...args);
    }

    public warn(message: string, ...args: any[]): void {
        this.logger.warn(message, ...args);
    }

    public error(message: string, ...args: any[]): void {
        this.logger.error(message, ...args);
    }

    public fatal(message: string, ...args: any[]): void {
        this.logger.fatal(message, ...args);
    }

    public isLevelEnabled(level: ILevel): boolean {
        return this.logger.isLevelEnabled(level);
    }

    public isTraceEnabled(): boolean {
        return this.logger.isTraceEnabled();
    }

    public isDebugEnabled(): boolean {
        return this.logger.isDebugEnabled();
    }

    public isInfoEnabled(): boolean {
        return this.logger.isInfoEnabled();
    }

    public isWarnEnabled(): boolean {
        return this.logger.isWarnEnabled();
    }

    public isErrorEnabled(): boolean {
        return this.logger.isErrorEnabled();
    }

    public isFatalEnabled(): boolean {
        return this.logger.isFatalEnabled();
    }

    public setLevel(level: string | ILevel): void {
        let lev: ILevel;

        if (!Types.isString(level)) {
            lev = level as ILevel;
        } else {
            lev = Level.toLevel(level as string);
        }
        return this.logger.setLevel(lev);
    }
}