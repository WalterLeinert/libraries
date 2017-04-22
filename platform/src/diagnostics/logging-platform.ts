import { Funktion, NotSupportedException } from '@fluxgate/core';
import { getLogger as getConsoleLogger, IConfig, ILogger, Logger, LoggerRegistry, Types } from '@fluxgate/core';

import { JsonReader } from '../util/jsonReader';

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

  let logger: ILogger;

  if (!LoggerRegistry.hasLogger(categoryName)) {
    // removeIf(node)
    logger = getConsoleLogger(categoryName);
    // endRemoveIf(node)

    // removeIf(browser)
    const log4js = require('log4js');
    logger = new Logger(log4js.getLogger(categoryName));

    LoggerRegistry.registerLogger(categoryName, logger);
    // endRemoveIf(browser)
  } else {
    logger = LoggerRegistry.getLogger(categoryName);
  }

  return logger;
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

  if (Types.isString(config)) {
    const conf = JsonReader.readJsonSync<IConfig>(config as string);
    LoggerRegistry.configure(conf as IConfig, options);
  } else {
    LoggerRegistry.configure(config as IConfig, options);
  }
  // endRemoveIf(browser)

  // removeIf(node)
  if (Types.isString(config)) {
    throw new NotSupportedException('only supported on node platforms');
  }
  LoggerRegistry.configure(config as IConfig, options);
  // endRemoveIf(node)

}