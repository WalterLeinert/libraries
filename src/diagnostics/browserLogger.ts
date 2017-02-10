import * as moment from 'moment';


import { Platform } from '../base/platform';
import { StringBuilder } from '../base/stringBuilder';
import { Dictionary } from '../types/dictionary';
import { Types } from '../types/types';

import { levels } from './level';
import { ILevel, } from './level.interface';
import { ILogger } from './logger.interface';


export class BrowserLogger implements ILogger {
    private _level: ILevel = levels.INFO;

    public static configure(filename: string, options?: any): void {
        // TODO
    }


    private constructor(private categoryName: string) {
    }


    /**
     * erzeugt eine neue Logger-Instanz
     */
    public static create(categoryName: string) {
        const logger = new BrowserLogger(categoryName);
        return logger;
    }

    public trace(message: string, ...args: any[]): void {
        if (this.isTraceEnabled()) {
            const sb = this.createLogPrefix();
            sb.append(message);
            console.trace(sb.toString(), ...args);
        }
    }

    public debug(message: string, ...args: any[]): void {
        if (this.isDebugEnabled()) {
            const sb = this.createLogPrefix();
            sb.append(message);
            console.debug(sb.toString(), ...args);
        }
    }

    public info(message: string, ...args: any[]): void {
        if (this.isInfoEnabled()) {
            const sb = this.createLogPrefix();
            sb.append(message);
            console.info(sb.toString(), ...args);
        }
    }

    public warn(message: string, ...args: any[]): void {
        if (this.isWarnEnabled()) {
            const sb = this.createLogPrefix();
            sb.append(message);
            console.warn(sb.toString(), ...args);
        }
    }

    public error(message: string, ...args: any[]): void {
        if (this.isErrorEnabled()) {
            const sb = this.createLogPrefix();
            sb.append(message);
            console.error(sb.toString(), ...args);
        }
    }

    public fatal(message: string, ...args: any[]): void {
        if (this.isFatalEnabled()) {
            const sb = this.createLogPrefix();
            sb.append(message);
            console.error(sb.toString(), ...args);
        }
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
        this._level = lev;
    }

    public get level(): ILevel {
        return this._level;
    }

    private createLogPrefix(): StringBuilder {
        const sb = new StringBuilder(moment().format('YYYY-MM-DD hh:mm:ss.SSS'));

        sb.append(' [');
        sb.append(this.level.toString());
        sb.append('] ');
        sb.append(this.categoryName);
        sb.append(' ');

        return sb;
    }

}