import { ILevel } from './level.interface';

/**
 * Interface für alle Logger (kompatibel zu log4js)
 *
 * @export
 * @interface ILogger
 */
export interface ILogger {
  /**
   * der Logger-Level
   */
  level: ILevel;

  /**
   * die Logger-Kategorie
   */
  category: string;

  /**
   * Ssetzt den Level auf @param{level}
   *
   * @param {(string | ILevel)} level
   *
   * @memberOf ILogger
   */
  setLevel(level: string | ILevel): void;

  /**
   * liefert true, falls der Logger für den Level @param{level} aktiviert ist.
   *
   * @param {ILevel} level
   * @returns {boolean}
   *
   * @memberOf ILogger
   */
  isLevelEnabled(level: ILevel): boolean;

  /**
   * liefert true, falls der Logger für den Level @see{levels.TRACE} aktiviert ist.
   *
   * @param {ILevel} level
   * @returns {boolean}
   *
   * @memberOf ILogger
   */
  isTraceEnabled(): boolean;

  /**
   * liefert true, falls der Logger für den Level @see{levels.DEBUG} aktiviert ist.
   *
   * @param {ILevel} level
   * @returns {boolean}
   *
   * @memberOf ILogger
   */
  isDebugEnabled(): boolean;

  /**
   * liefert true, falls der Logger für den Level @see{levels.INFO} aktiviert ist.
   *
   * @param {ILevel} level
   * @returns {boolean}
   *
   * @memberOf ILogger
   */
  isInfoEnabled(): boolean;

  /**
   * liefert true, falls der Logger für den Level @see{levels.WARN} aktiviert ist.
   *
   * @param {ILevel} level
   * @returns {boolean}
   *
   * @memberOf ILogger
   */
  isWarnEnabled(): boolean;

  /**
   * liefert true, falls der Logger für den Level @see{levels.ERROR} aktiviert ist.
   *
   * @param {ILevel} level
   * @returns {boolean}
   *
   * @memberOf ILogger
   */
  isErrorEnabled(): boolean;

  /**
   * liefert true, falls der Logger für den Level @see{levels.FATAL} aktiviert ist.
   *
   * @param {ILevel} level
   * @returns {boolean}
   *
   * @memberOf ILogger
   */
  isFatalEnabled(): boolean;

  /**
   * erzeugt eine Logausgabe, falls der Logger für den Level @see{levels.TRACE} aktiviert ist.
   *
   * @param {string} message
   * @param {...any[]} args
   *
   * @memberOf ILogger
   */
  trace(message: string, ...args: any[]): void;

  /**
   * erzeugt eine Logausgabe, falls der Logger für den Level @see{levels.DEBUG} aktiviert ist.
   *
   * @param {string} message
   * @param {...any[]} args
   *
   * @memberOf ILogger
   */
  debug(message: string, ...args: any[]): void;

  /**
   * erzeugt eine Logausgabe, falls der Logger für den Level @see{levels.INFO} aktiviert ist.
   *
   * @param {string} message
   * @param {...any[]} args
   *
   * @memberOf ILogger
   */
  info(message: string, ...args: any[]): void;

  /**
   * erzeugt eine Logausgabe, falls der Logger für den Level @see{levels.WARN} aktiviert ist.
   *
   * @param {string} message
   * @param {...any[]} args
   *
   * @memberOf ILogger
   */
  warn(message: string, ...args: any[]): void;

  /**
   * erzeugt eine Logausgabe, falls der Logger für den Level @see{levels.ERROR} aktiviert ist.
   *
   * @param {string} message
   * @param {...any[]} args
   *
   * @memberOf ILogger
   */
  error(message: string, ...args: any[]): void;

  /**
   * erzeugt eine Logausgabe, falls der Logger für den Level @see{levels.FATAL} aktiviert ist.
   *
   * @param {string} message
   * @param {...any[]} args
   *
   * @memberOf ILogger
   */
  fatal(message: string, ...args: any[]): void;
}