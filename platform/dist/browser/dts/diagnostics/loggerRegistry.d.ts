import { IConfig } from './config.interface';
import { ILogger } from './logger.interface';
export declare class LoggerRegistry {
    private static loggerDict;
    private static _config;
    private static defaultLevel;
    /**
     * Konfiguriert das Logging
     *
     * @static
     * @param {string | IConfig} config
     * @param {*} [options]
     *
     * @memberOf BrowserLogger
     */
    static configure(config: string | IConfig, options?: any): void;
    private static registerConfiguration(config);
    static registerLogger(categoryName: string, logger: ILogger): void;
    static getLogger(categoryName: string): ILogger;
    static getLoggerCount(): number;
    static hasLogger(categoryName: string): boolean;
    static dump(): void;
    static forEachLogger(callbackfn: (value: ILogger, index: number, array: ILogger[]) => void, thisArg?: any): void;
    private static applyConfiguration(config);
}
