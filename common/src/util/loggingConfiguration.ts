import path = require('path');
import process = require('process');

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { fromEnvironment, StringBuilder, Utility } from '@fluxgate/core';


export interface ILoggingConfigurationOptions {
  systemMode?: string;
  filename?: string;
  relativePath?: string;
}

export class LoggingConfiguration {
  protected static readonly logger = getLogger(LoggingConfiguration);

  public static readonly DEFAULT_FILENAME = 'log4js';
  public static readonly DEFAULT_EXTENSION = '.json';
  public static readonly DEFAULT_RELATIVE_PATH = '/config';

  /**
   * Liefert den absoluten Pfad auf die Log4js Konfigurationsdatei
   *
   * @param {string} systemMode - der Systemmodus (z.B. 'local' oder 'development')
   * @param {string} filename - der Name der Konfigurationsdatei (default: 'log4js)
   */
  public static getConfigurationPath(info?: string | ILoggingConfigurationOptions): string {
    return using(new XLog(LoggingConfiguration.logger, levels.INFO, 'getConfigurationPath'), (log) => {

      let options: ILoggingConfigurationOptions;

      if (!info) {
        // defaults
        options = {
          systemMode: null,
          filename: LoggingConfiguration.DEFAULT_FILENAME,
          relativePath: LoggingConfiguration.DEFAULT_RELATIVE_PATH
        };

      } else {
        if (typeof info === 'string') {
          options = {
            systemMode: info,
            filename: LoggingConfiguration.DEFAULT_FILENAME,
            relativePath: LoggingConfiguration.DEFAULT_RELATIVE_PATH
          };

        } else if (typeof info === 'object') {
          options = info;
        }
      }

      if (fromEnvironment('LOG4JS_DEBUG', '-not-set-') !== '-not-set-') {
        log.info(`options = ${JSON.stringify(options)}`);
      }

      if (!options.filename) {
        options.filename = LoggingConfiguration.DEFAULT_FILENAME;
      }
      if (!options.relativePath) {
        options.relativePath = LoggingConfiguration.DEFAULT_RELATIVE_PATH;
      }

      const sb = new StringBuilder(options.filename);
      if (!Utility.isNullOrEmpty(options.systemMode)) {
        sb.append('.');
        sb.append(options.systemMode);
      }
      sb.append(LoggingConfiguration.DEFAULT_EXTENSION);

      let configPath = path.join(options.relativePath, sb.toString());
      configPath = path.join(process.cwd(), configPath);

      return configPath;
    });
  }
}