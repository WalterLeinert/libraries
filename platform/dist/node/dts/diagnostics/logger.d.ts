import { Funktion } from '@fluxgate/core';
import { IConfig } from './config.interface';
import { ILevel } from './level.interface';
import { ILogger } from './logger.interface';
/**
 * Liefert den Logger für die angegebene Kategorie
 *
 * @export
 * @param {(string | Function)} category
 * @returns {ILogger}
 */
export declare function getLogger(category: string | Funktion): ILogger;
/**
 * Konfiguriert das Logging über die Json-Datei @param{config} oder die entsprechende Konfiguration und die Options.
 *
 * @export
 * @param {string} filename
 * @param {*} [options]
 */
export declare function configure(config: string | IConfig, options?: any): void;
/**
 * Proxy für log4js bzw. @see{BrowserLogger}.
 */
export declare class Logger implements ILogger {
    private logger;
    constructor(logger: ILogger);
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
    toString(): string;
}
