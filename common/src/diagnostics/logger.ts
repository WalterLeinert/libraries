import { Funktion } from '../base/objectType';
import { Types } from '../types/types';
import { BrowserLogger } from './browserLogger';
import { IConfig } from './config.interface';
import { Level } from './level';
import { ILevel } from './level.interface';
import { ILogger } from './logger.interface';
import { LoggerRegistry } from './loggerRegistry';


/**
 * Liefert den Logger für die angegebene Kategorie
 *
 * @export
 * @param {(string | Function)} category
 * @returns {ILogger}
 */
export function getLogger(category: string | Funktion): ILogger {
  let categoryName: string;
  if (typeof category === 'string') {
    categoryName = category;
  } else {
    categoryName = category.name;
  }

  if (!LoggerRegistry.hasLogger(categoryName)) {
    let logger: ILogger;

    // removeIf(node)
    logger = new Logger(BrowserLogger.create(categoryName));
    // endRemoveIf(node)

    // removeIf(browser)
    const log4js = require('log4js');
    logger = new Logger(log4js.getLogger(categoryName));
    // endRemoveIf(browser)

    LoggerRegistry.registerLogger(categoryName, logger);
  }

  return LoggerRegistry.getLogger(categoryName);
}


/**
 * Konfiguriert das Logging über die Json-Datei @param{config} oder die entsprechende Konfiguration und die Options.
 *
 * @export
 * @param {string} filename
 * @param {*} [options]
 */
export function configure(config: string | IConfig, options?: any): void {

  // removeIf(browser)
  const log4js = require('log4js');
  log4js.configure(config, options);
  // endRemoveIf(browser)

  // removeIf(node)
  LoggerRegistry.configure(config, options);
  // endRemoveIf(node)
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
    this.logger.setLevel(lev);
  }

  public get level(): ILevel {
    return this.logger.level;
  }
}