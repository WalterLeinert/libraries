import path = require('path');
import process = require('process');

import { fromEnvironment } from './env';
import { StringBuilder, StringUtil } from '../base';

export interface LoggingConfigurationOptions {
    systemMode?: string;
    filename?: string;
    relativePath?: string;
}

export class LoggingConfiguration {
    public static readonly DEFAULT_FILENAME = 'log4js';
    public static readonly DEFAULT_EXTENSION = '.json';
    public static readonly DEFAULT_RELATIVE_PATH = '/config';

    public static getConfigurationPath(systemMode?: string): string;
    public static getConfigurationPath(configurationOptions?: LoggingConfigurationOptions): string;

    /**
     * Liefert den absoluten Pfad auf die Log4js Konfigurationsdatei
     * 
     * @param {string} systemMode - der Systemmodus (z.B. 'local' oder 'development')
     * @param {string} filename - der Name der Konfigurationsdatei (default: 'log4js)
     */
    public static getConfigurationPath(info?: string | LoggingConfigurationOptions): string {
        let options: LoggingConfigurationOptions;

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
            console.info(`options = ${JSON.stringify(options)}`);
        }

        if (!options.filename) {
            options.filename = LoggingConfiguration.DEFAULT_FILENAME;
        }
        if (!options.relativePath) {
            options.relativePath = LoggingConfiguration.DEFAULT_RELATIVE_PATH;
        }
       
        let sb = new StringBuilder(options.filename);
        if (!StringUtil.isNullOrEmpty(options.systemMode)) {
            sb.append('.');
            sb.append(options.systemMode);
        }
        sb.append(LoggingConfiguration.DEFAULT_EXTENSION);

        let configPath = path.join(options.relativePath, sb.toString());
        configPath = path.join(process.cwd(), configPath);

        return configPath;
    }
}