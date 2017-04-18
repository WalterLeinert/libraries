import { Assert, Dictionary } from '@fluxgate/core';

import { JsonReader } from '../util/jsonReader';
import { IConfig } from './config.interface';
import { levels } from './level';
import { Level } from './level';
import { ILevel } from './level.interface';
import { ILogger } from './logger.interface';


export class LoggerRegistry {
  private static loggerDict: Dictionary<string, ILogger> = new Dictionary<string, ILogger>();

  private static _config: IConfig;
  private static defaultLevel: ILevel = levels.ERROR;


  /**
   * Konfiguriert das Logging
   *
   * @static
   * @param {string | IConfig} config
   * @param {*} [options]
   *
   * @memberOf BrowserLogger
   */
  public static configure(config: string | IConfig, options?: any): void {

    if (typeof config === 'string') {
      JsonReader.readJson<IConfig>(config, (conf) => {
        //
        const cfg = conf as IConfig;

        LoggerRegistry.registerConfiguration(cfg);
      });
    } else {
      LoggerRegistry.registerConfiguration(config);
    }
  }


  private static registerConfiguration(config: IConfig) {
    Assert.notNull(config);
    LoggerRegistry._config = config;

    const level = LoggerRegistry._config.levels['[all]'];
    if (level) {
      LoggerRegistry.defaultLevel = Level.toLevel(level);
    }

    LoggerRegistry.applyConfiguration(config);
  }

  public static registerLogger(categoryName: string, logger: ILogger) {
    LoggerRegistry.loggerDict.set(categoryName, logger);
  }

  public static getLogger(categoryName: string): ILogger {
    Assert.notNullOrEmpty(categoryName);
    Assert.that(LoggerRegistry.hasLogger(categoryName));

    const logger = LoggerRegistry.loggerDict.get(categoryName);
    logger.setLevel(LoggerRegistry.defaultLevel);

    if (LoggerRegistry._config) {
      const level = LoggerRegistry._config.levels[categoryName];
      if (level) {
        logger.setLevel(level);
      }
    }

    return logger;
  }

  public static getLoggerCount(): number {
    return LoggerRegistry.loggerDict.count;
  }

  public static hasLogger(categoryName: string): boolean {
    return LoggerRegistry.loggerDict.containsKey(categoryName);
  }

  public static dump() {
    // tslint:disable-next-line:no-console
    console.log(`LoggerRegistry.dump: ${LoggerRegistry.getLoggerCount()} loggers:`);
    LoggerRegistry.loggerDict.keys.forEach((key) => {
      // tslint:disable-next-line:no-console
      console.log(`  ${key}`);
    });
  }

  public static forEachLogger(callbackfn: (value: ILogger, index: number, array: ILogger[]) => void, thisArg?: any):
    void {
    const loggers = LoggerRegistry.loggerDict.values;

    for (let i = 0; i < loggers.length; i++) {
      callbackfn(loggers[i], i, loggers);
    }
  }

  private static applyConfiguration(config: IConfig) {
    LoggerRegistry.forEachLogger((logger) => {
      const catLevel = LoggerRegistry._config.levels[logger.category];
      if (catLevel) {
        logger.setLevel(Level.toLevel(catLevel));
      } else {
        logger.setLevel(LoggerRegistry.defaultLevel);
      }
    });
  }
}