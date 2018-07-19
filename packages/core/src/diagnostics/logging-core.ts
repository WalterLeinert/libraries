import { Funktion } from '../base/objectType';
import { Types } from '../types/types';
import { IConfig } from './config.interface';
import { ConsoleLogger } from './consoleLogger';
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
  if (Types.isString(category)) {
    categoryName = category as string;
  } else {
    categoryName = (category as Funktion).name;
  }

  if (!LoggerRegistry.hasLogger(categoryName)) {
    const logger = ConsoleLogger.create(categoryName);

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
export function configure(config: IConfig): void {
  LoggerRegistry.configure(config);
}