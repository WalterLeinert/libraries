import { Disposable } from '@fluxgate/core';
import { ILevel } from './level.interface';
import { ILogger } from './logger.interface';
/**
 * Logger for method entry, exit and arbitrary logs based on
 * the disposable pattern.
 *
 * @see {EnterExitLogger} works in conjunction with
 * @see {using}.
 */
export declare class XLog extends Disposable implements ILogger {
    private static indentation;
    private static readonly EnterExitStrings;
    private static readonly defaultIndentation;
    private static readonly maxIndentations;
    private static readonly indentationLevels;
    private static levels;
    private static initEnterExitLogger;
    private functionName;
    private _level;
    private logger;
    private startTime;
    private endTime;
    /**
     * Initializes a new instance and triggers method entry log, update indentation
     *
     * @param {log4js.Logger}: logger - the native logger
     * @param {log4js.Level}: level - the minimum log level
     * @param {string} functionName - the name of the method to be logged
     * @param {string} message - the message to belogged
     * @param {any[]} args - optional message arguments
     */
    constructor(logger: ILogger, level: ILevel, functionName: string, message?: string, ...args: any[]);
    /**
     * logs a message for the current log level, which was set in constructor
     */
    log(message: string, ...args: any[]): void;
    /**
     * logs a message for log level @see{levels.TRACE}.
     */
    trace(message: string, ...args: any[]): void;
    /**
     * logs a message for log level @see{levels.DEBUG}.
     */
    debug(message: string, ...args: any[]): void;
    /**
     * logs a message for log level @see{levels.INFO}.
     */
    info(message: string, ...args: any[]): void;
    /**
     * logs a message for log level @see{levels.WARN}.
     */
    warn(message: string, ...args: any[]): void;
    /**
     * logs a message for log level @see{levels.ERROR}.
     */
    error(message: string | Error, ...args: any[]): void;
    /**
     * logs a message for log level @see{levels.FATAL}.
     */
    fatal(message: string | Error, ...args: any[]): void;
    isLevelEnabled(level: ILevel): boolean;
    /**
     * returns true, if the logger is enabled for the current level
     */
    isEnabled(): boolean;
    isTraceEnabled(): boolean;
    isDebugEnabled(): boolean;
    isInfoEnabled(): boolean;
    isWarnEnabled(): boolean;
    isErrorEnabled(): boolean;
    isFatalEnabled(): boolean;
    setLevel(level: string | ILevel): void;
    readonly level: ILevel;
    readonly categoryName: string;
    /**
     * triggers method exit log, update indentation
     */
    protected onDispose(): void;
    /**
     * forwards different kind of log messages to @see {log4js}
     *
     * @param {EnterExit} kind - kind of log message
     * @param {Level} level - log level
     * @param {string} message - log message
     * @param {any[]} ...args - additional log arguments
     */
    private logInternal(kind, level, message?, ...args);
    /**
     * returns true, if the logger is enabled for the given level.
     *
     * @param {Level} level - the log level to test
     */
    private isEnabledFor(level);
    private extractErrorMessage(message);
}
