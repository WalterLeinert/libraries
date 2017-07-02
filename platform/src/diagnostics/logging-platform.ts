import { Funktion, NotSupportedException } from '@fluxgate/core';
import { getLogger as getConsoleLogger, IConfig, ILogger, Logger, LoggerRegistry, Types } from '@fluxgate/core';

import { JsonReader } from '../util/jsonReader';
import { LoggerFacade } from './logger-facade';

let loggerFacade;

// removeIf(node)
import { BrowserLoggerFacade } from './browser-logger-facade';
loggerFacade = new BrowserLoggerFacade();
// endRemoveIf(node)

// removeIf(browser)
import { NodeLoggerFacade } from './node-logger-facade';
loggerFacade = new NodeLoggerFacade();
// endRemoveIf(browser)


/**
 * Liefert den Logger für die angegebene Kategorie
 *
 * @export
 * @param {(string | Function)} category
 * @returns {ILogger}
 */
export function getLogger(category: string | Funktion): ILogger {
  return loggerFacade.getLogger(category);
}


/**
 * Konfiguriert das Logging über die Json-Datei @param{config} oder die entsprechende Konfiguration und die Options.
 *
 * @export
 * @param {string} filename
 * @param {*} [options]
 */
export function configure(config: string | IConfig, options?: any): void {
  return loggerFacade.configure(config, options);
}