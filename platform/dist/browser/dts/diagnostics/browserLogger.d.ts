import { ILevel } from './level.interface';
import { ILogger } from './logger.interface';
export declare class BrowserLogger implements ILogger {
    private _categoryName;
    private _level;
    private constructor(_categoryName);
    /**
     * erzeugt eine neue Logger-Instanz
     */
    static create(categoryName: string): BrowserLogger;
    trace(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    fatal(message: string, ...args: any[]): void;
    isLevelEnabled(level: ILevel): boolean;
    isTraceEnabled(): boolean;
    isDebugEnabled(): boolean;
    isInfoEnabled(): boolean;
    isWarnEnabled(): boolean;
    isErrorEnabled(): boolean;
    isFatalEnabled(): boolean;
    setLevel(level: string | ILevel): void;
    readonly level: ILevel;
    readonly categoryName: string;
    private createLogPrefix(level);
}
