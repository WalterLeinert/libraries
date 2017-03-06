import * as moment from 'moment';

import { Disposable } from '../base/disposable';
import { StringBuilder } from '../base/stringBuilder';
import { Types } from '../types/types';

import { levels } from './level';
import { Level } from './level';
import { ILevel } from './level.interface';
import { ILogger } from './logger.interface';

/**
 * Type of logging
 */
enum EnterExit {
  Enter = 0,      // method entry
  Exit,           // method exit
  Log             // regular log
}

/**
 * Logger for method entry, exit and arbitrary logs based on 
 * the disposable pattern.
 * 
 * @see {EnterExitLogger} works in conjunction with 
 * @see {using}.
 */

export class XLog extends Disposable implements ILogger {
  private static indentation = -1;

  private static readonly EnterExitStrings: string[] = ['>> ', '<< ', '@  '];
  private static readonly defaultIndentation = 2;
  private static readonly maxIndentations = 30;
  private static readonly indentationLevels = new Array<string>();

  private static levels = levels;

  // tslint:disable-next-line:no-unused-variable
  private static initEnterExitLogger: boolean = (() => {
    let indentString = '';
    for (let j = 0; j < XLog.defaultIndentation; j++) {
      indentString = indentString + ' ';
    }
    let indent = '';

    for (let i = 0; i < XLog.maxIndentations; i++) {
      // console.log('initialize: i = ' + i + ', indent = \'' + indent + '\'' );
      XLog.indentationLevels.push(indent);
      indent = indent + indentString;
    }

    return true;
  })();

  private functionName: string;
  private _level: ILevel;
  private logger: ILogger;
  private startTime: moment.Moment;
  private endTime: moment.Moment;




  /**
   * Initializes a new instance and triggers method entry log, update indentation
   * 
   * @param {log4js.Logger}: logger - the native logger
   * @param {log4js.Level}: level - the minimum log level
   * @param {string} functionName - the name of the method to be logged
   * @param {string} message - the message to belogged
   * @param {any[]} args - optional message arguments 
   */
  constructor(logger: ILogger, level: ILevel, functionName: string, message?: string, ...args: any[]) {
    super();
    this.startTime = moment();

    this.logger = logger;
    this._level = level;
    this.functionName = functionName;

    XLog.indentation++;
    this.logInternal(EnterExit.Enter, this._level, message, ...args);
  }

  /**
   * logs a message for the current log level, which was set in constructor
   */
  public log(message: string, ...args: any[]): void {
    this.logInternal(EnterExit.Log, this._level, message, ...args);
  }


  /**
   * logs a message for log level @see{levels.TRACE}.
   */
  public trace(message: string, ...args: any[]): void {
    this.logInternal(EnterExit.Log, XLog.levels.TRACE, message, ...args);
  }

  /**
   * logs a message for log level @see{levels.DEBUG}.
   */
  public debug(message: string, ...args: any[]): void {
    this.logInternal(EnterExit.Log, XLog.levels.DEBUG, message, ...args);
  }

  /**
   * logs a message for log level @see{levels.INFO}.
   */
  public info(message: string, ...args: any[]): void {
    this.logInternal(EnterExit.Log, XLog.levels.INFO, message, ...args);
  }

  /**
   * logs a message for log level @see{levels.WARN}.
   */
  public warn(message: string, ...args: any[]): void {
    this.logInternal(EnterExit.Log, XLog.levels.WARN, message, ...args);
  }

  /**
   * logs a message for log level @see{levels.ERROR}.
   */
  public error(message: string, ...args: any[]): void {
    this.logInternal(EnterExit.Log, XLog.levels.ERROR, message, ...args);
  }

  /**
   * logs a message for log level @see{levels.FATAL}.
   */
  public fatal(message: string, ...args: any[]): void {
    this.logInternal(EnterExit.Log, XLog.levels.FATAL, message, ...args);
  }

  public isLevelEnabled(level: ILevel): boolean {
    return this._level.isLessThanOrEqualTo(level);
  }

  /**
   * returns true, if the logger is enabled for the current level
   */
  public isEnabled(): boolean {
    return this.isEnabledFor(this._level);
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
    this._level = lev;
  }

  public get level(): ILevel {
    return this._level;
  }


  /**
   * triggers method exit log, update indentation
   */
  protected onDispose(): void {
    try {
      this.endTime = moment();
      this.logInternal(EnterExit.Exit, this._level);
      XLog.indentation--;
    } finally {
      super.onDispose();
    }
  }


  /**
   * forwards different kind of log messages to @see {log4js}
   * 
   * @param {EnterExit} kind - kind of log message
   * @param {Level} level - log level
   * @param {string} message - log message
   * @param {any[]} ...args - additional log arguments 
   */
  private logInternal(kind: EnterExit, level: ILevel, message?: string, ...args: any[]): void {
    const indent = XLog.indentationLevels[XLog.indentation];
    let prefix = indent + XLog.EnterExitStrings[kind] + this.functionName;
    const prefixedMessage = new StringBuilder();

    // prefix not empty message 
    if (message && message.length > 0) {
      prefix = prefix + ': ';
    }
    prefixedMessage.append(prefix);

    if (message !== undefined) {
      prefixedMessage.append(message);
    }

    if (kind === EnterExit.Exit) {
      const elapsed = this.endTime.diff(this.startTime);
      prefixedMessage.append(` [elapsed: ${elapsed} ms]`);
    }

    switch (level) {
      case XLog.levels.TRACE:
        this.logger.trace(prefixedMessage.toString(), ...args);
        break;
      case XLog.levels.DEBUG:
        this.logger.debug(prefixedMessage.toString(), ...args);
        break;
      case XLog.levels.INFO:
        this.logger.info(prefixedMessage.toString(), ...args);
        break;
      case XLog.levels.WARN:
        this.logger.warn(prefixedMessage.toString(), ...args);
        break;
      case XLog.levels.ERROR:
        this.logger.error(prefixedMessage.toString(), ...args);
        break;
      case XLog.levels.FATAL:
        this.logger.fatal(prefixedMessage.toString(), ...args);
        break;
      default:
        throw new Error('undefined log level: ' + level);
    }
  }


  /**
   * returns true, if the logger is enabled for the given level.
   * 
   * @param {Level} level - the log level to test
   */
  private isEnabledFor(level: ILevel): boolean {
    switch (level) {
      case XLog.levels.TRACE:
        return this.logger.isTraceEnabled();
      case XLog.levels.DEBUG:
        return this.logger.isDebugEnabled();
      case XLog.levels.INFO:
        return this.logger.isInfoEnabled();
      case XLog.levels.WARN:
        return this.logger.isWarnEnabled();
      case XLog.levels.ERROR:
        return this.logger.isErrorEnabled();
      case XLog.levels.FATAL:
        return this.logger.isFatalEnabled();
      default:
        throw new Error('undefined log level: ' + level);
    }
  }
}